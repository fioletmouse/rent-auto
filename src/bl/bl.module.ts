import { Module } from '@nestjs/common';
import { BLService } from './bl.service';

@Module({
  providers: [BLService],
  exports: [BLService],
})
export class BLModule {}