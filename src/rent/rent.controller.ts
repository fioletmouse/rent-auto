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
  async prelimCalc(@Query() queryParams: RentInput): Promise<number> {
    return await this.appService.prelimCalc(queryParams);
  }

  @Post('book')
  async book(@Query() queryParams: RentInput) {
    return await this.appService.book(queryParams);
  }

  @Get('report')
  async report() {

  }
}
