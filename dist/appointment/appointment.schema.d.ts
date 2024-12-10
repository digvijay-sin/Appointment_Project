import mongoose, { HydratedDocument } from 'mongoose';
export type appointmentDocument = HydratedDocument<Appointment>;
export declare class Appointment {
    userId: mongoose.Types.ObjectId;
    date: Date;
    description?: string;
    startTime: string;
    endTime: string;
}
export declare const AppointmentSchema: mongoose.Schema<Appointment, mongoose.Model<Appointment, any, any, any, mongoose.Document<unknown, any, Appointment> & Appointment & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Appointment, mongoose.Document<unknown, {}, mongoose.FlatRecord<Appointment>> & mongoose.FlatRecord<Appointment> & {
    _id: Types.ObjectId;
}>;
