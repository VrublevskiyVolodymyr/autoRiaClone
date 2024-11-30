import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';

import { UserID } from '../../../../common/types/entity-ids.type';
import { BaseCarDto } from './base-car.dto';

export class CreateCarWithPhotoDto extends PickType(BaseCarDto, [
  'producer',
  'model',
  'power',
  'year',
  'mileage',
  'numberDoors',
  'numberSeats',
  'color',
]) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Array of photos to upload',
  })
  photos: Express.Multer.File[];

  @ApiHideProperty()
  public user_id?: UserID;
}
