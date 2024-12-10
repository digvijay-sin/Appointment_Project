import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './register.schema';
export declare class RegisterController {
    private readonly registerService;
    constructor(registerService: RegisterService);
    create(createUserDto: CreateUserDto): Promise<{
        user: User;
        token: string;
    }>;
    loginUser(body: any): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    getAllUser(): Promise<User[]>;
    verifyToken(request: Request): Promise<any>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
