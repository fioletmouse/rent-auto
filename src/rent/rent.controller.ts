import { Controller, Get } from '@nestjs/common';
import { RentService } from './rent.service';

@Controller()
export class RentController {
  constructor(private readonly appService: RentService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
