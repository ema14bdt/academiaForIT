import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ViewAvailableSlotsDto } from './dto/view-available-slots.dto';
import { AvailableSlot } from '@domain/use-cases/ViewAvailableSlots';
import { CreateAvailabilityInput } from '@domain/use-cases/CreateAvailability';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@domain/entities/User';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('available-slots')
  async getAvailableSlots(
    @Query() query: ViewAvailableSlotsDto,
  ): Promise<AvailableSlot[]> {
    const date = new Date(query.date);
    return this.availabilityService.findAvailableSlots({
      date,
      serviceDuration: query.serviceDuration,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROFESSIONAL)
  create(
    @Body() createAvailabilityDto: CreateAvailabilityInput,
  ): Promise<void> {
    return this.availabilityService.createAvailability(createAvailabilityDto);
  }
}
