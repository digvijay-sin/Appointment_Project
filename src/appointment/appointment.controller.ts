import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDTO } from './dto/createAppointment.dto';
import { Appointment } from './appointment.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { RolesDecorator } from 'src/roles.decorator';
import { Roles } from 'src/roles.enum';
import { UpdateAppointmentDTO } from './dto/updateAppointment.dto';
import { User } from 'src/register/register.schema';


@Controller('appointment')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) { }
  

  @Get('/availableSlots')
  async getAvailableTimeSlots(@Query('date') date: string) {
    // Validate the date format

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid date format. Use yyyy-mm-dd.');
    }

    const normalizedDate = new Date(date + 'T00:00:00Z'); // Append time part and treat as UTC

    if (isNaN(normalizedDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // Pass the normalized date to the service method
    const slots = await this.appointmentService.getAvailableTimeSlots(normalizedDate);
    return slots;
  }

  @Post('/bookSlot')
  async bookSlot(@Body() createAppointmentDto: CreateAppointmentDTO): Promise<Appointment> {
    console.log("inside book slot",createAppointmentDto)
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

 @Get('/userWithAppointment')
  @UseGuards(JwtAuthGuard, RolesGuard)
 @RolesDecorator(Roles.Admin)
  async getUserWithAppointment() {
      return this.appointmentService.getUserWithAppointment()
  }

  @Get('userdata')
  @UseGuards(RolesGuard)
  async getUserData(@Query('userId') userId: string) {
    try {
      const userData = await this.appointmentService.getUserData(userId);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Unable to fetch user data');
    }
  }

  @Delete('delete')
    async deleteAppointment(@Query('id') id: string): Promise<Appointment> {
       return  await this.appointmentService.deleteAppointment(id);
    }

    @Put('update')
    async updateAppointment(@Query('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDTO ): Promise<Appointment> {
        return await this.appointmentService.updateAppointment(id, updateAppointmentDto);
    }

}
