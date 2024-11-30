import { PickType } from '@nestjs/swagger';

import { BaseCarResDto } from './base-car.res.dto';

export class PublicCarResDto extends PickType(BaseCarResDto, [
  'id',
  'producer',
  'model',
  'power',
  'year',
  'color',
  'mileage',
  'numberDoors',
  'numberSeats',
  'photos',
]) {}
