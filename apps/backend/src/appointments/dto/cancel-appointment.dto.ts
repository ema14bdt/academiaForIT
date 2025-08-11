import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CancelAppointmentDto {
  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @IsOptional()
  @IsString()
  cancellingUserId?: string; // Optional, for client cancellations
}
