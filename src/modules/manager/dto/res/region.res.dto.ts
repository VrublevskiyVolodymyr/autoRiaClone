import { ApiProperty } from '@nestjs/swagger';

import { RegionID } from '../../../../common/types/entity-ids.type';

export class RegionResDto {
  @ApiProperty({ type: 'RegionId' })
  id: RegionID;
  region: string;
}
