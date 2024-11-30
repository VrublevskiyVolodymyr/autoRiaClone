import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PriceCarDto {
  id?: string;

  @ApiProperty({ example: '300000.00', description: 'Price in UAH' })
  @Expose({ name: 'UAH' })
  UAH: number;

  @ApiProperty({ example: '12000.00', description: 'Price in USD' })
  @Expose({ name: 'USD' })
  USD: number;

  @ApiProperty({ example: '10000.00', description: 'Price in EUR' })
  @Expose({ name: 'EUR' })
  EUR: number;
}
