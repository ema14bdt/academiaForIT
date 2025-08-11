import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ViewAvailableSlotsDto } from './dto/view-available-slots.dto';
import { AvailableSlot } from '@domain/use-cases/ViewAvailableSlots';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('available-slots')
  async getAvailableSlots(@Query() query: ViewAvailableSlotsDto): Promise<AvailableSlot[]> {
    // Convert date string to Date object for domain use case
    const date = new Date(query.date);
    return this.availabilityService.findAvailableSlots({ date, serviceDuration: query.serviceDuration });
  }
}
