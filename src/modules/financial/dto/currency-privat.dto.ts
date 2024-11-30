import { ApiProperty } from '@nestjs/swagger';

import { CurrencyID } from '../../../common/types/entity-ids.type';

export class CurrencyPrivatDto {
  id?: CurrencyID;

  @ApiProperty({ description: 'Currency name', example: 'USD' })
  name: string;

  @ApiProperty({ description: 'Base currency', example: 'UAH' })
  baseCurrency: string;

  @ApiProperty({ description: 'Purchase rate', example: 36.56 })
  buyRate: number;

  @ApiProperty({ description: 'Sales rate', example: 36.9 })
  sellRate: number;
}
