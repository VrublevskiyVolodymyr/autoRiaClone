import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseCarDto {
  @ApiProperty({ example: 'Tesla' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  producer: string;

  @ApiProperty({ example: 'Model S' })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  model: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(6000)
  @Type(() => Number)
  public power?: number;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear())
  public year: number;

  @ApiProperty({ example: 'Red' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 15000 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  mileage: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  numberDoors: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  numberSeats: number;

  @IsArray()
  @IsNotEmpty()
  photos: string[];
}
