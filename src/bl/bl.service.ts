import { Injectable } from '@nestjs/common';

@Injectable()
export class BLService {
  constructor() {}

  IsMaxDayLimit = () => {
    return false;
  }
}