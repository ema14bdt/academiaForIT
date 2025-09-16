import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAppointments(@Request() req) {
    try {
      const appointments = await this.appointmentsService.getAppointmentsByUserId(req.user.userId);
      return appointments;
    } catch (error) {
      return [];
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async bookAppointment(@Body() dto: BookAppointmentDto, @Request() req) {
    const appointment = await this.appointmentsService.book({
      clientId: req.user.userId,
      serviceId: dto.serviceId,
      startTime: new Date(dto.startTime),
    });
    return appointment;
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelAppointment(
    @Param('id') appointmentId: string,
    @Request() req,
  ): Promise<void> {
    await this.appointmentsService.cancel({
      appointmentId,
      cancellingUserId: req.user.userId,
    });
  }
}
