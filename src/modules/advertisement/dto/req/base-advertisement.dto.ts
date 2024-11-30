import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { UserID } from '../../../../common/types/entity-ids.type';
import { PriceCarDto } from '../../../cars/dto/res/price-car.dto';
import { PublicCarResDto } from '../../../cars/dto/res/public-car.res.dto';
import { CurrencyEnum } from '../../../financial/enums/cerrency.enum';
import { ViewAdvertisementDto } from '../res/view-advertisement.dto';

export class BaseAdvertisementDto {
  public id: string;

  @ApiProperty({
    example: 'Selling a car',
    description: 'Title of the advertisement',
  })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    example: 'Great condition, low mileage...',
    description: 'Description of the advertisement',
  })
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    example: 0,
    description: 'Number of views on the advertisement',
    default: 0,
  })
  public views?: number;

  @ApiProperty({
    example: true,
    description: 'Status of the advertisement',
    default: true,
  })
  @IsBoolean()
  public status?: boolean;

  @ApiProperty({ type: () => PublicCarResDto, description: 'Car details' })
  public car?: PublicCarResDto;

  @ApiProperty({ example: 'Kyiv', description: 'Region of the advertisement' })
  @IsString()
  @IsNotEmpty()
  @Transform(TransformHelper.trim)
  public region: string;

  @ApiProperty({
    type: () => PriceCarDto,
    description: 'Price details of the car',
  })
  public priceCar?: PriceCarDto;

  @ApiProperty({
    description: 'Price of the car',
    type: 'number',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public price: number;

  @ApiProperty({ enum: CurrencyEnum, description: 'Currency of the price' })
  @IsEnum(CurrencyEnum)
  public currency: CurrencyEnum;

  @ApiProperty({
    example: 'd9bfbf99-fbbe-4e9d-a0b1-48dbe65d3278',
    description: 'ID of the user who created the advertisement',
  })
  public user_id?: UserID;

  public editCount?: number;

  @ApiProperty({
    type: () => [ViewAdvertisementDto],
    description: 'List of advertisement views',
  })
  public advertisementViews?: ViewAdvertisementDto[];
}
