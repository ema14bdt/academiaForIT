import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ViewAvailableSlotsDto } from './dto/view-available-slots.dto';
import { AvailableSlot } from '@domain/use-cases/ViewAvailableSlots';
import { CreateAvailabilityInput } from '@domain/use-cases/CreateAvailability';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@domain/entities/User';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // This endpoint is public or for all authenticated users
  @Get('available-slots')
  async getAvailableSlots(
    @Query() query: ViewAvailableSlotsDto,
  ): Promise<AvailableSlot[]> {
    // Convert date string to Date object for domain use case
    const date = new Date(query.date);
    return this.availabilityService.findAvailableSlots({
      date,
      serviceDuration: query.serviceDuration,
    });
  }

  // This endpoint is protected and only accessible by PROFESSIONALS
  // Assumes an AuthGuard runs before the RolesGuard
  @Post()
  @Roles(Role.PROFESSIONAL)
  @UseGuards(RolesGuard) // You would typically have @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body() createAvailabilityDto: CreateAvailabilityInput,
  ): Promise<void> {
    return this.availabilityService.createAvailability(createAvailabilityDto);
  }
}
