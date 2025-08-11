import { IsDateString, IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ViewAvailableSlotsDto {
  @IsNotEmpty()
  @IsDateString()
  date: string; // Use string for date input, convert in service/controller

  @IsNotEmpty()
  @IsInt()
  @Min(30)
  @Max(90)
  @Type(() => Number)
  serviceDuration: number; // in minutes (30, 60, 90)
}
