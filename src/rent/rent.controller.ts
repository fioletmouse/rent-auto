import { Controller, Get, Post, Query } from '@nestjs/common';
import { RentInput } from './rent.dto';
import { RentService } from './rent.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('rent')
@Controller()
export class RentController {
  constructor(private readonly appService: RentService) {}

  @Get('isAvailable')
  async isAvailable(@Query() queryParams: RentInput): Promise<boolean> {
    return await this.appService.isAvailable(queryParams);
  }

  @Get('calculation')
  async prelimCalc(id: number, start: Date, end: Date) {

  }

  @Post('book')
  async book(id: number, start: Date, end: Date) {

  }

  @Get('report')
  async report() {

  }
}
