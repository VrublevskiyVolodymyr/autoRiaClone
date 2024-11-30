import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateCarDto } from '../../../cars/dto/req/create-car.dto';
import { BaseAdvertisementDto } from './base-advertisement.dto';

export class CreateAdvertisementWithCarDto extends PickType(
  BaseAdvertisementDto,
  ['title', 'description', 'price', 'currency', 'region'],
) {
  @ApiProperty({ type: () => CreateCarDto, description: 'Car details' })
  @ValidateNested()
  @Type(() => CreateCarDto)
  public car: CreateCarDto;
}
