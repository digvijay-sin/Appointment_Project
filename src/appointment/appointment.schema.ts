import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type appointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {

  @Prop({})
  userId: mongoose.Types.ObjectId;

  @Prop({})
  date:Date;

  @Prop({})
  description?:string;

  @Prop({})
  startTime:string;

  @Prop({})
  endTime:string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);