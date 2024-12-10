import { IsString, IsDate, IsOptional, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAppointmentDTO {
  
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  endTime: string;
}
