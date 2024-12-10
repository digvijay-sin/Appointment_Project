import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './register.schema';
import { LoginDto } from 'src/register/dto/login.dto';
import { validate } from 'class-validator';


@Controller('register')
export class RegisterController {
    constructor(private readonly registerService:RegisterService){}

    @Post('/createUser')
    async create(@Body() createUserDto:CreateUserDto):Promise<{ user: User; token: string }>{
        return this.registerService.create(createUserDto);
    }
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() body: any): Promise<{ user,accessToken: string,refreshToken:string}> {

      const loginDto = new LoginDto();
      loginDto.email = body.email;
      loginDto.password = body.password;
      const errors = await validate(loginDto);
      if (errors.length > 0) {
        throw new BadRequestException('Validation failed');
      }
      const allowedFields = ['email', 'password'];
      const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));
      if (extraFields.length > 0) {
        throw new BadRequestException(`Extra fields are not allowed: ${extraFields.join(', ')}`);
      }
      return this.registerService.loginUser(loginDto);
    }

     @Get('/getAllUser')
     async getAllUser():Promise<User[]>{
        return this.registerService.getAllUser();
     }

     @Get('/verifytoken')
     async verifyToken(@Req() request: Request): Promise<any> {
        
         const token = request.headers['authorization']?.split(' ')[1] || '';
        
         if (!token) {
             throw new UnauthorizedException('Token is missing');
         }

         const decoded = await this.registerService.verifyToken(token);

         return decoded;
     }

     @Post('refresh')
     async refresh(@Body() body: { refresh_token: string }):Promise<{accessToken: string,refreshToken:string}> {
       try {
        console.log("refresh token",body.refresh_token);
         const newTokens = await this.registerService.refreshToken(body.refresh_token);
         return newTokens;
       } catch (error) {
           throw new UnauthorizedException('Token is Expired');
       }
     }
}
