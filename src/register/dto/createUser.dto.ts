import { IsString, IsEmail, Matches, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'confirmPassword is required.' })
  confirmPassword: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phone: string;

  role:string;
}
