import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/db.module';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment],
    }),
    DatabaseModule,
  ],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
