"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const appointment_schema_1 = require("./appointment.schema");
const mongoose_2 = require("mongoose");
const mongodb_1 = require("mongodb");
let AppointmentService = class AppointmentService {
    constructor(appointmentModel) {
        this.appointmentModel = appointmentModel;
        this.userDataShow = false;
    }
    async getAvailableTimeSlots(date) {
        const slotDurationInMinutes = 30;
        const allAppointments = await this.appointmentModel.find().exec();
        const targetDateStr = date.toISOString().split('T')[0];
        const appointments = allAppointments.filter(appointment => {
            const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
            return appointmentDateStr === targetDateStr;
        });
        const availableSlots = [];
        const currentDate = new Date();
        const currentDateFormat = currentDate.toISOString().split('T')[0];
        let startOfDay;
        if (targetDateStr < currentDateFormat) {
            throw new common_1.BadRequestException('Date has not been exist These date has been gone!');
        }
        if (currentDateFormat === targetDateStr) {
            startOfDay = new Date(date);
            startOfDay.setHours(currentDate.getHours() + 1, 0, 0, 0);
        }
        else {
            startOfDay = new Date(date.setHours(10, 0, 0, 0));
        }
        const endOfDay = new Date(date.setHours(19, 0, 0, 0));
        const minutesToTime = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${String(hour12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
        };
        const timeToMinutes = (time) => {
            const [timePart, ampm] = time.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);
            let hour24 = hours;
            if (ampm === 'PM' && hours < 12)
                hour24 += 12;
            if (ampm === 'AM' && hours === 12)
                hour24 = 0;
            return hour24 * 60 + minutes;
        };
        let currentTime = startOfDay;
        while (currentTime < endOfDay) {
            const endTime = new Date(currentTime.getTime() + slotDurationInMinutes * 60000);
            if (endTime > endOfDay)
                break;
            const currentTimeStr = minutesToTime(currentTime.getHours() * 60 + currentTime.getMinutes());
            const endTimeStr = minutesToTime(endTime.getHours() * 60 + endTime.getMinutes());
            const isAvailable = !appointments.some(appointment => {
                const appointmentStartTime = appointment.startTime;
                const appointmentEndTime = appointment.endTime;
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
    async createAppointment(createAppointmentDto) {
        const { userId, date, description, startTime, endTime } = createAppointmentDto;
        const appointment = new this.appointmentModel({
            userId: new mongoose_2.default.Types.ObjectId(userId),
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
                    'userDetails._id': 1,
                    'userDetails.name': 1,
                    'userDetails.email': 1,
                    'userDetails.phone': 1
                }
            },
            {
                $sort: {
                    date: -1
                }
            }
        ]);
        return userWithAppointment;
    }
    async getUserData(userId) {
        try {
            const userWithAppointment = await this.appointmentModel.aggregate([
                {
                    $match: {
                        userId: new mongodb_1.ObjectId(userId)
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
                    $sort: {
                        date: -1
                    }
                }
            ]).exec();
            return userWithAppointment;
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Unable to fetch user data');
        }
    }
    async deleteAppointment(appointmentId) {
        if (!mongoose_2.default.Types.ObjectId.isValid(appointmentId)) {
            throw new common_1.BadRequestException('Invalid appointment ID format');
        }
        const appointment = await this.appointmentModel.findById(appointmentId).exec();
        if (!appointment) {
            throw new common_1.BadRequestException('Appointment not found');
        }
        const result = await this.appointmentModel.deleteOne({ _id: new mongoose_2.default.Types.ObjectId(appointmentId) }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.BadRequestException('Failed to delete appointment');
        }
        return appointment;
    }
    async updateAppointment(appointmentId, updateAppointmentDto) {
        if (!mongoose_2.default.Types.ObjectId.isValid(appointmentId)) {
            throw new common_1.BadRequestException('Invalid appointment ID format');
        }
        const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(new mongoose_2.default.Types.ObjectId(appointmentId), { $set: updateAppointmentDto }, { new: true }).exec();
        if (!updatedAppointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return updatedAppointment;
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map