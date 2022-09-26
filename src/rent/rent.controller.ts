import { Controller, Get, Query } from '@nestjs/common';
import { RentInput } from './rent.dto';
import { RentService } from './rent.service';

@Controller()
export class RentController {
  constructor(private readonly appService: RentService) {}

  @Get()
  async isAvailable(@Query() queryParams: RentInput): Promise<boolean> {
    return await this.appService.isAvailable();
  }
  async prelimCalc(id: number, start: Date, end: Date) {

  }

  async book(id: number, start: Date, end: Date) {

  }
  async report() {

  }
}
