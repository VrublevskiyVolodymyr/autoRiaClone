import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { UserID } from '../../../../common/types/entity-ids.type';
import { RegionEnum } from '../../../cars/enums/region.enum';
import { CurrencyEnum } from '../../../financial/enums/cerrency.enum';

export class AdvertisementQueryAdminDto {
  @ApiProperty({
    example: 'Selling a car',
    description: 'Title of the advertisement',
  })
  @IsOptional()
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  public title?: string;

  @ApiProperty({
    example: 'Great condition, low mileage...',
    description: 'Description of the advertisement',
  })
  @IsOptional()
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  public description?: string;

  @ApiProperty({
    example: true,
    description: 'Status of the advertisement',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  public status?: boolean;

  @ApiProperty({ description: 'Region of the advertisement' })
  @IsOptional()
  public region?: RegionEnum;

  @ApiProperty({
    example: 0,
    description: 'Number of views on the advertisement',
    default: 0,
  })
  @IsOptional()
  public views?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public editCount?: number;

  @ApiProperty({
    description: 'Price of the car',
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public price?: number;

  @ApiProperty({ enum: CurrencyEnum, description: 'Currency of the price' })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  public currency?: CurrencyEnum;

  @ApiProperty({
    example: 'd9bfbf99-fbbe-4e9d-a0b1-48dbe65d3278',
    description: 'ID of the user who created the advertisement',
  })
  @IsOptional()
  public user_id?: UserID;

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
