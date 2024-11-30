import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CarID } from '../../../../common/types/entity-ids.type';
import { BaseAdvertisementDto } from './base-advertisement.dto';

export class CreateAdvertisementByCarIdDto extends PickType(
  BaseAdvertisementDto,
  ['title', 'description', 'price', 'currency', 'region'],
) {
  @ApiProperty({
    description: 'UUID of the car associated with the advertisement',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  public carId: CarID;
}
