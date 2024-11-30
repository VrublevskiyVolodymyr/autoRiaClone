import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEnum } from '../../financial/enums/cerrency.enum';

export class AveragePriceDto {
  @ApiProperty({
    description: 'The currency of the average price',
    enum: CurrencyEnum,
    example: CurrencyEnum.USD,
  })
  currency: CurrencyEnum;

  @ApiProperty({
    description: 'The average price of the advertisement',
    example: 15000,
  })
  averagePrice: number;
}
