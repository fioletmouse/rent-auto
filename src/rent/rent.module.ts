import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/db.module';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environment';
import { BLModule } from 'src/bl/bl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment],
    }),
    DatabaseModule,
    BLModule
  ],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
