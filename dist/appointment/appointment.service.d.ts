import { Appointment } from './appointment.schema';
import mongoose, { Model } from 'mongoose';
import { CreateAppointmentDTO } from './dto/createAppointment.dto';
import { UpdateAppointmentDTO } from './dto/updateAppointment.dto';
export declare class AppointmentService {
    private appointmentModel;
    constructor(appointmentModel: Model<Appointment>);
    userDataShow: boolean;
    getAvailableTimeSlots(date: Date): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
    createAppointment(createAppointmentDto: CreateAppointmentDTO): Promise<mongoose.Document<unknown, {}, Appointment> & Appointment & {
        _id: mongoose.Types.ObjectId;
    }>;
    getUserWithAppointment(): Promise<any[]>;
    getUserData(userId: string): Promise<any[]>;
    deleteAppointment(appointmentId: string): Promise<Appointment>;
    updateAppointment(appointmentId: string, updateAppointmentDto: UpdateAppointmentDTO): Promise<Appointment>;
}
