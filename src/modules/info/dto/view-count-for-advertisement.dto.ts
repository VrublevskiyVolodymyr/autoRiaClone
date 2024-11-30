import { ApiProperty } from '@nestjs/swagger';

import { AdvertisementID } from '../../../common/types/entity-ids.type';

export class ViewCountForAdvertisementDto {
  @ApiProperty({
    description: 'The ID of the advertisement',
    example: 123,
  })
  advertisementId: AdvertisementID;

  @ApiProperty({
    description: 'The number of views for the advertisement',
    example: 1500,
  })
  viewCount: number;
}
