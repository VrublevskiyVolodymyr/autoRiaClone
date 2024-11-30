import { PickType } from '@nestjs/swagger';

import { AdvertisementQueryAdminDto } from './advertisement-query-admin.dto';

export class AdvertisementQueryDto extends PickType(
  AdvertisementQueryAdminDto,
  [
    'title',
    'description',
    'currency',
    'price',
    'region',
    'model',
    'producer',
    'color',
    'mileage',
    'numberDoors',
    'numberSeats',
    'power',
    'year',
  ],
) {}
