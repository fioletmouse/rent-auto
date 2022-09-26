import { NestFactory } from '@nestjs/core';
import { RentModule } from './rent/rent.module';

async function bootstrap() {
  const app = await NestFactory.create(RentModule);
  await app.listen(3000);
}
bootstrap();
