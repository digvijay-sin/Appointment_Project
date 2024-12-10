import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop({required:true})
  name: string;

  @Prop({required:true})
  password:string;

  @Prop({required:true,unique:true})
  email:string;

  @Prop({required:true})
  phone:string;

  @Prop({default:'user'})
  role:string;
}

export const UserSchema = SchemaFactory.createForClass(User);