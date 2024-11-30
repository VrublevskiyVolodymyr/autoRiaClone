import { PickType } from '@nestjs/swagger';

import { BaseAdvertisementDto } from '../req/base-advertisement.dto';

export class PublicAdvertisementResDto extends PickType(BaseAdvertisementDto, [
  'id',
  'title',
  'description',
  'price',
  'currency',
  'region',
  'priceCar',
  'car',
]) {}
