import { Module } from "@nestjs/common";
import { dbProvider } from "./db.provider";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [dbProvider],
  exports: [dbProvider]
})
export class DatabaseModule {}
