import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { UserID } from '../../../../common/types/entity-ids.type';
import { BaseCarDto } from './base-car.dto';

export class CreateCarDto extends PickType(BaseCarDto, [
  'producer',
  'model',
  'power',
  'year',
  'mileage',
  'numberDoors',
  'numberSeats',
  'color',
]) {
  @ApiHideProperty()
  @IsOptional()
  public user_id?: UserID;
}
