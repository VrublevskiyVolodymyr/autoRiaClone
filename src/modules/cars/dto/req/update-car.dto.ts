import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class UpdateCarDto {
  @ApiProperty({ example: 'Tesla' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Type(() => String)
  @IsOptional()
  producer?: string;

  @ApiProperty({ example: 'Model S' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Type(() => String)
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  power?: number;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 'Red' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 15000 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  mileage?: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  numberDoors?: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  numberSeats?: number;
}
