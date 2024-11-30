import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CarQueryDto {
  @ApiProperty({ example: 'Tesla' })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsOptional()
  @Length(3, 50)
  @Type(() => String)
  public producer?: string;

  @ApiProperty({ example: 'Model S' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(2, 50)
  @IsOptional()
  @Type(() => String)
  public model?: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Max(6000)
  @Type(() => Number)
  public power?: number;

  @ApiProperty({ example: 2021 })
  @IsOptional()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear())
  public year?: number;

  @ApiProperty({ example: 'Red' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public color?: string;

  @ApiProperty({ example: 15000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  public mileage?: number;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  public numberDoors?: number;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  public numberSeats?: number;
}
