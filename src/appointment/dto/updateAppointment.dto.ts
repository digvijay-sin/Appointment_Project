import { IsString, IsDate, IsOptional, IsMongoId } from 'class-validator';

export class UpdateAppointmentDTO {
  
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
