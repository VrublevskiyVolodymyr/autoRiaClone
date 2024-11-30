import { ApiProperty } from '@nestjs/swagger';

import { ModelID } from '../../../../common/types/entity-ids.type';

export class ModelResDto {
  @ApiProperty({ type: 'ModelID' })
  id: ModelID;
  model: string;
}
