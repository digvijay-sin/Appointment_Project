import { BadRequestException, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './register.schema';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/register/dto/login.dto';

@Injectable()
export class RegisterService {

    private readonly saltRounds = 10;
    private readonly JWT_SECRET = 'secretkey'; 
    private readonly JWT_EXPIRES_IN = '1min'; 

    private readonly JWT_SECRET_REFRESH='refreshtoken';
    private readonly JWT_EXPIRES_IN_REFRESH='7d';

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
        if (createUserDto.password !== createUserDto.confirmPassword) {
          throw new BadRequestException('Password and confirm password do not match');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
        const createdUser = new this.userModel({
          ...createUserDto,
          password: hashedPassword,
        });
    
        await createdUser.save();
        const token = this.generateToken(createUserDto.email,createUserDto.role);
        return {
          user: createdUser,
          token,
        };
      }


    private generateToken(email: string,role:string): string {
        return jwt.sign({ id: email,role:role}, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
      }
      private generateRefreshToken(email: string,role:string): string {
        return jwt.sign({ id: email,role:role}, this.JWT_SECRET_REFRESH, { expiresIn: this.JWT_EXPIRES_IN_REFRESH});
      }



    async loginUser(loginDto:LoginDto):Promise<{ user,accessToken: string,refreshToken:string}>{
        const user = await this.userModel.findOne({ email : loginDto.email });
        if(!user){
            throw new NotFoundException('User with ID not found');
        }
        const isMatch = await bcrypt.compare(loginDto.password , user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
          }
          const accessToken = this.generateToken(user.id,user.role);
          const refreshToken = this.generateRefreshToken(user.id,user.role);
          return { user, accessToken, refreshToken};
     }

     async getAllUser():Promise<User[]>{
      return await this.userModel.find().exec();
     }

     async verifyToken(token: string): Promise<any> {
      try {
          // Verify the token and decode its payload
          const decoded = jwt.verify(token, this.JWT_SECRET);
          return { valid: true, decoded };
      } catch (error) {
          throw new UnauthorizedException('Invalid or expired token');
      }
  }

 


  async loginUserRefresh(loginDto:LoginDto):Promise<{accessToken: string,refreshToken:string}>{
    const user = await this.userModel.findOne({ email : loginDto.email });
    if(!user){
        throw new NotFoundException('User with ID not found');
    }
      
    if (loginDto.password!==user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const accessToken = this.generateToken(user.id,user.role);
      const refreshToken = this.generateRefreshToken(user.id,user.role);
      return {accessToken, refreshToken};
 }
  async refreshToken(oldRefreshToken: string) {
    try {
      const payload: any = jwt.verify(oldRefreshToken, this.JWT_SECRET_REFRESH); 
      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }
      const loginDto = new LoginDto();
      loginDto.email=user.email;
      loginDto.password=user.password;
      return this.loginUserRefresh(loginDto);
    } catch (error) {
      throw new NotFoundException('refresh token Invalid or not found');
    }
  }

}
