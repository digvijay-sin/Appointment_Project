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
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const register_service_1 = require("./register.service");
const createUser_dto_1 = require("./dto/createUser.dto");
const login_dto_1 = require("./dto/login.dto");
const class_validator_1 = require("class-validator");
let RegisterController = class RegisterController {
    constructor(registerService) {
        this.registerService = registerService;
    }
    async create(createUserDto) {
        return this.registerService.create(createUserDto);
    }
    async loginUser(body) {
        const loginDto = new login_dto_1.LoginDto();
        loginDto.email = body.email;
        loginDto.password = body.password;
        const errors = await (0, class_validator_1.validate)(loginDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException('Validation failed');
        }
        const allowedFields = ['email', 'password'];
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            throw new common_1.BadRequestException(`Extra fields are not allowed: ${extraFields.join(', ')}`);
        }
        return this.registerService.loginUser(loginDto);
    }
    async getAllUser() {
        return this.registerService.getAllUser();
    }
    async verifyToken(request) {
        const token = request.headers['authorization']?.split(' ')[1] || '';
        if (!token) {
            throw new common_1.UnauthorizedException('Token is missing');
        }
        const decoded = await this.registerService.verifyToken(token);
        return decoded;
    }
    async refresh(body) {
        try {
            console.log("refresh token", body.refresh_token);
            const newTokens = await this.registerService.refreshToken(body.refresh_token);
            return newTokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token is Expired');
        }
    }
};
exports.RegisterController = RegisterController;
__decorate([
    (0, common_1.Post)('/createUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Get)('/getAllUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Get)('/verifytoken'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "refresh", null);
exports.RegisterController = RegisterController = __decorate([
    (0, common_1.Controller)('register'),
    __metadata("design:paramtypes", [register_service_1.RegisterService])
], RegisterController);
//# sourceMappingURL=register.controller.js.map