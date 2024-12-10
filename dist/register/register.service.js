"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const register_schema_1 = require("./register.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login_dto_1 = require("./dto/login.dto");
let RegisterService = class RegisterService {
    constructor(userModel) {
        this.userModel = userModel;
        this.saltRounds = 10;
        this.JWT_SECRET = 'secretkey';
        this.JWT_EXPIRES_IN = '1min';
        this.JWT_SECRET_REFRESH = 'refreshtoken';
        this.JWT_EXPIRES_IN_REFRESH = '7d';
    }
    async create(createUserDto) {
        if (createUserDto.password !== createUserDto.confirmPassword) {
            throw new common_1.BadRequestException('Password and confirm password do not match');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        await createdUser.save();
        const token = this.generateToken(createUserDto.email, createUserDto.role);
        return {
            user: createdUser,
            token,
        };
    }
    generateToken(email, role) {
        return jwt.sign({ id: email, role: role }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
    generateRefreshToken(email, role) {
        return jwt.sign({ id: email, role: role }, this.JWT_SECRET_REFRESH, { expiresIn: this.JWT_EXPIRES_IN_REFRESH });
    }
    async loginUser(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
            throw new common_1.NotFoundException('User with ID not found');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = this.generateToken(user.id, user.role);
        const refreshToken = this.generateRefreshToken(user.id, user.role);
        return { user, accessToken, refreshToken };
    }
    async getAllUser() {
        return await this.userModel.find().exec();
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            return { valid: true, decoded };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async loginUserRefresh(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
            throw new common_1.NotFoundException('User with ID not found');
        }
        if (loginDto.password !== user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = this.generateToken(user.id, user.role);
        const refreshToken = this.generateRefreshToken(user.id, user.role);
        return { accessToken, refreshToken };
    }
    async refreshToken(oldRefreshToken) {
        try {
            const payload = jwt.verify(oldRefreshToken, this.JWT_SECRET_REFRESH);
            const user = await this.userModel.findById(payload.id);
            if (!user) {
                throw new Error('User not found');
            }
            const loginDto = new login_dto_1.LoginDto();
            loginDto.email = user.email;
            loginDto.password = user.password;
            return this.loginUserRefresh(loginDto);
        }
        catch (error) {
            throw new common_1.NotFoundException('refresh token Invalid or not found');
        }
    }
};
exports.RegisterService = RegisterService;
exports.RegisterService = RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(register_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RegisterService);
//# sourceMappingURL=register.service.js.map