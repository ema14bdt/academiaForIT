import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string; // Use string for date input, convert in controller
}
