import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { RegionEnum } from '../../../cars/enums/region.enum';
import { CurrencyEnum } from '../../../financial/enums/cerrency.enum';

export class UpdateAdvertisementDto {
  @ApiProperty({
    example: 'Selling a car',
    description: 'Title of the advertisement',
  })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title?: string;

  @ApiProperty({
    example: 'Great condition, low mileage...',
    description: 'Description of the advertisement',
  })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description?: string;

  @ApiProperty({ example: 'Kyiv', description: 'Region of the advertisement' })
  @IsOptional()
  public region?: RegionEnum;

  @ApiProperty({
    description: 'Price of the car',
    type: 'number',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  public price?: number;

  @ApiProperty({ enum: CurrencyEnum, description: 'Currency of the price' })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  public currency?: CurrencyEnum;
}
