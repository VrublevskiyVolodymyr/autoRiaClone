import { ApiProperty } from '@nestjs/swagger';

import { ProducerID } from '../../../../common/types/entity-ids.type';

export class ProducerResDto {
  @ApiProperty({ type: 'ProducerID' })
  id: ProducerID;
  producer: string;
}
