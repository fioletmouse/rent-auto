import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RentInput {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    readonly start: Date;
    
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    readonly end: Date
  }