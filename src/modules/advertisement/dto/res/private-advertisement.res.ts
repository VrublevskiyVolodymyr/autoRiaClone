import { PickType } from '@nestjs/swagger';

import { BaseAdvertisementDto } from '../req/base-advertisement.dto';

export class AdvertisementPrivateResDto extends PickType(BaseAdvertisementDto, [
  'id',
  'title',
  'description',
  'price',
  'currency',
  'region',
  'priceCar',
  'car',
  'views',
  'status',
  'editCount',
  'user_id',
]) {}
