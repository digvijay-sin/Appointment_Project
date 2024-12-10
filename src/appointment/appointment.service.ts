import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './appointment.schema';
import mongoose, { Model } from 'mongoose';
import { CreateAppointmentDTO } from './dto/createAppointment.dto';
import { ObjectId } from 'mongodb';
import { UpdateAppointmentDTO } from './dto/updateAppointment.dto';

@Injectable()
export class AppointmentService {

    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<Appointment>) { }

    userDataShow:boolean=false;


    async getAvailableTimeSlots(date: Date): Promise<{ startTime: string; endTime: string }[]> {
        const slotDurationInMinutes = 30;
        const allAppointments = await this.appointmentModel.find().exec();
        const targetDateStr = date.toISOString().split('T')[0];
        // Get all existing appointments for the given date
        const appointments = allAppointments.filter(appointment => {
            const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
            return appointmentDateStr === targetDateStr;
        });
        // Initialize an array to hold available slots
        const availableSlots: { startTime: string; endTime: string }[] = [];

        // Set start and end of the day with custom hours
        const currentDate = new Date();
        const currentDateFormat = currentDate.toISOString().split('T')[0];
        let startOfDay: Date;
        if (targetDateStr < currentDateFormat) {
            throw new BadRequestException('Date has not been exist These date has been gone!');
        }
        if (currentDateFormat === targetDateStr) {
            // Set start of the day to the current time if today, but with custom hours
            startOfDay = new Date(date);
            startOfDay.setHours(currentDate.getHours() + 1, 0, 0, 0);
        } else {
            // Start at 10:00 AM for other days
            startOfDay = new Date(date.setHours(10, 0, 0, 0));
        }
        const endOfDay = new Date(date.setHours(19, 0, 0, 0)); // End at 7:00 PM

        // Function to convert minutes to "hh:mm a" (12-hour format)
        const minutesToTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12; // Convert to 12-hour format
            return `${String(hour12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
        };

        // Function to convert time string to minutes
        const timeToMinutes = (time: string) => {
            const [timePart, ampm] = time.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);
            let hour24 = hours;
            if (ampm === 'PM' && hours < 12) hour24 += 12;
            if (ampm === 'AM' && hours === 12) hour24 = 0;
            return hour24 * 60 + minutes;
        };

        let currentTime = startOfDay;

        while (currentTime < endOfDay) {
            const endTime = new Date(currentTime.getTime() + slotDurationInMinutes * 60000);

            if (endTime > endOfDay) break;

            // Convert times to strings in "hh:mm a" format
            const currentTimeStr = minutesToTime(currentTime.getHours() * 60 + currentTime.getMinutes()); // "hh:mm a"
            const endTimeStr = minutesToTime(endTime.getHours() * 60 + endTime.getMinutes()); // "hh:mm a"

            // Check if this slot overlaps with any existing appointments
            const isAvailable = !appointments.some(appointment => {
                const appointmentStartTime = appointment.startTime; // "hh:mm a"
                const appointmentEndTime = appointment.endTime; // "hh:mm a"

                return !(timeToMinutes(currentTimeStr) >= timeToMinutes(appointmentEndTime) ||
                    timeToMinutes(endTimeStr) <= timeToMinutes(appointmentStartTime));
            });

            if (isAvailable) {
                availableSlots.push({ startTime: currentTimeStr, endTime: endTimeStr });
            }

            currentTime = new Date(currentTime.getTime() + slotDurationInMinutes * 60000);
        }

        return availableSlots;
    }



    async createAppointment(createAppointmentDto: CreateAppointmentDTO) {
        const { userId, date, description, startTime, endTime } = createAppointmentDto;

        // Convert userId to ObjectId
        const appointment = new this.appointmentModel({
            userId: new mongoose.Types.ObjectId(userId),
            date,
            description,
            startTime,
            endTime,
        });

        return await appointment.save();
    }

    async getUserWithAppointment() {
        const userWithAppointment = await this.appointmentModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    date: 1,
                    description: 1,
                    startTime: 1,
                    endTime: 1,
                    'userDetails._id':1,
                    'userDetails.name': 1,
                    'userDetails.email': 1,
                    'userDetails.phone': 1
                }
            },
            {
                $sort:{
                    date:-1
                }
            }
        ]);

        return userWithAppointment;
    }


    async getUserData(userId: string) {
        try {
            const userWithAppointment = await this.appointmentModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId) 
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        date: 1,
                        description: 1,
                        startTime: 1,
                        endTime: 1,
                        'userDetails._id': 1,
                        'userDetails.name': 1,
                        'userDetails.email': 1,
                        'userDetails.phone': 1
                    }
                },
                {
                    $sort:{
                        date:-1
                    }
                }
            ]).exec(); 
            return userWithAppointment;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Unable to fetch user data');
        }
    }

    async deleteAppointment(appointmentId: string): Promise<Appointment> {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw new BadRequestException('Invalid appointment ID format');
        }
        const appointment = await this.appointmentModel.findById(appointmentId).exec();
    
        if (!appointment) {
            throw new BadRequestException('Appointment not found');
        }
        const result = await this.appointmentModel.deleteOne({ _id: new mongoose.Types.ObjectId(appointmentId) }).exec();
    
        if (result.deletedCount === 0) {
            throw new BadRequestException('Failed to delete appointment');
        }
        return appointment;
    }

    async updateAppointment(appointmentId: string, updateAppointmentDto: UpdateAppointmentDTO): Promise<Appointment> {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw new BadRequestException('Invalid appointment ID format');
        }
        const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(appointmentId),
            { $set: updateAppointmentDto },
            { new: true }
        ).exec();
        if (!updatedAppointment) {
            throw new NotFoundException('Appointment not found');
        }
        return updatedAppointment;
    }
    
}
