import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('/')
  async bookAppointment(@Body() dto: BookAppointmentDto): Promise<void> {
    await this.appointmentsService.book({
      clientId: dto.clientId,
      serviceId: dto.serviceId,
      startTime: new Date(dto.startTime),
    });
  }

  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id') appointmentId: string,
    @Body() dto: CancelAppointmentDto,
  ): Promise<void> {
    await this.appointmentsService.cancel({
      appointmentId,
      cancellingUserId: dto.cancellingUserId || null,
    });
  }
}
