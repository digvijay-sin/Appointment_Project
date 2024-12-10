import { Model } from 'mongoose';
import { User } from './register.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from 'src/register/dto/login.dto';
export declare class RegisterService {
    private userModel;
    private readonly saltRounds;
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly JWT_SECRET_REFRESH;
    private readonly JWT_EXPIRES_IN_REFRESH;
    constructor(userModel: Model<User>);
    create(createUserDto: CreateUserDto): Promise<{
        user: User;
        token: string;
    }>;
    private generateToken;
    private generateRefreshToken;
    loginUser(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    getAllUser(): Promise<User[]>;
    verifyToken(token: string): Promise<any>;
    loginUserRefresh(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(oldRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
