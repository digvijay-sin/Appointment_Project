import { AppointmentService } from './appointment.service';
import { CreateAppointmentDTO } from './dto/createAppointment.dto';
import { Appointment } from './appointment.schema';
import { UpdateAppointmentDTO } from './dto/updateAppointment.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    getAvailableTimeSlots(date: string): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
    bookSlot(createAppointmentDto: CreateAppointmentDTO): Promise<Appointment>;
    getUserWithAppointment(): Promise<any[]>;
    getUserData(userId: string): Promise<any[]>;
    deleteAppointment(id: string): Promise<Appointment>;
    updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDTO): Promise<Appointment>;
}
