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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const createAppointment_dto_1 = require("./dto/createAppointment.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../roles.guard");
const roles_decorator_1 = require("../roles.decorator");
const roles_enum_1 = require("../roles.enum");
const updateAppointment_dto_1 = require("./dto/updateAppointment.dto");
let AppointmentController = class AppointmentController {
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    async getAvailableTimeSlots(date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new common_1.BadRequestException('Invalid date format. Use yyyy-mm-dd.');
        }
        const normalizedDate = new Date(date + 'T00:00:00Z');
        if (isNaN(normalizedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const slots = await this.appointmentService.getAvailableTimeSlots(normalizedDate);
        return slots;
    }
    async bookSlot(createAppointmentDto) {
        console.log("inside book slot", createAppointmentDto);
        return this.appointmentService.createAppointment(createAppointmentDto);
    }
    async getUserWithAppointment() {
        return this.appointmentService.getUserWithAppointment();
    }
    async getUserData(userId) {
        try {
            const userData = await this.appointmentService.getUserData(userId);
            return userData;
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Unable to fetch user data');
        }
    }
    async deleteAppointment(id) {
        return await this.appointmentService.deleteAppointment(id);
    }
    async updateAppointment(id, updateAppointmentDto) {
        return await this.appointmentService.updateAppointment(id, updateAppointmentDto);
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Get)('/availableSlots'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAvailableTimeSlots", null);
__decorate([
    (0, common_1.Post)('/bookSlot'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAppointment_dto_1.CreateAppointmentDTO]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "bookSlot", null);
__decorate([
    (0, common_1.Get)('/userWithAppointment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(roles_enum_1.Roles.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getUserWithAppointment", null);
__decorate([
    (0, common_1.Get)('userdata'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getUserData", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "deleteAppointment", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateAppointment_dto_1.UpdateAppointmentDTO]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateAppointment", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, common_1.Controller)('appointment'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map