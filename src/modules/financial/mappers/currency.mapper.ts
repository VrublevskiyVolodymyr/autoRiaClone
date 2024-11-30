import { CurrencyPrivatBankEntity } from '../../../database/entities/currency-privat-bank.entity';
import { CurrencyPrivatDto } from '../dto/currency-privat.dto';

export class CurrencyMapper {
  public static toCurrencyDto(
    data: CurrencyPrivatBankEntity,
  ): CurrencyPrivatDto {
    return {
      name: data.name,
      baseCurrency: data.baseCurrency,
      buyRate: data.buyRate,
      sellRate: data.sellRate,
    };
  }
}
