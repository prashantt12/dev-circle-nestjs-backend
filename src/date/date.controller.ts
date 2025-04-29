import { Controller, Post, Body } from '@nestjs/common';
import { DateService } from './date.service';

@Controller('date')
export class DateController {
  constructor(private readonly dateService: DateService) {}

  @Post('validate')
  validateDate(@Body('date') date: string): string {
    return this.dateService.validateDate(date);
  }
}
