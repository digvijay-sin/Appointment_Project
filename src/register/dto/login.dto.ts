import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
    
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
  }
