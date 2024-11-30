import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { Config, PrivatBankConfig } from '../../../config/config.types';
import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { CurrencyPrivatBankEntity } from '../../../database/entities/currency-privat-bank.entity';
import { PriceCarEntity } from '../../../database/entities/price-car.entity';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { CurrencyPrivatBankRepository } from '../../repository/services/currency-privat-bank.repository';

@Injectable()
export class CurrencyService {
  private readonly privatBankConfig: PrivatBankConfig;

  constructor(
    private readonly currencyRepository: CurrencyPrivatBankRepository,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.privatBankConfig =
      this.configService.get<PrivatBankConfig>('privatbank');
  }

  @Cron('0 0 0 * * *')
  async updateCurrencyRates(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.privatBankConfig.privatbankApiUrl),
      );

      const currencies: CurrencyPrivatBankEntity[] = response.data.map(
        (currency: {
          ccy: string;
          base_ccy: string;
          buy: string;
          sale: string;
        }) => ({
          name: currency.ccy,
          baseCcy: currency.base_ccy || 'UAH',
          buyRate: parseFloat(currency.buy),
          sellRate: parseFloat(currency.sale),
        }),
      );

      for (const currency of currencies) {
        const existingCurrency = await this.currencyRepository.findOneBy({
          name: currency.name,
        });
        if (existingCurrency) {
          existingCurrency.buyRate = currency.buyRate;
          existingCurrency.sellRate = currency.sellRate;
          await this.currencyRepository.save(existingCurrency);
        } else {
          await this.currencyRepository.save(currency);
        }
      }

      const advertisements = await this.advertisementRepository.find();
      for (const advertisement of advertisements) {
        if (advertisement.currency === 'UAH') {
          await this.convertCurrency(advertisement);
        } else {
          await this.setDefaultPriceCar(advertisement);
        }
      }
    } catch (error) {
      throw new HttpException('Error updating currency rates', 500);
    }
  }

  async getCurrencyRate(currencyName: string): Promise<number> {
    const currency = await this.currencyRepository.findOneBy({
      name: currencyName,
    });
    if (!currency)
      throw new NotFoundException(
        `Currency rate for ${currencyName} not found.`,
      );
    return currency.sellRate;
  }

  async convertCurrency(advertisement: AdvertisementEntity): Promise<void> {
    const sellRateUSD = await this.getCurrencyRate('USD');
    const sellRateEUR = await this.getCurrencyRate('EUR');

    const priceUSD = advertisement.price / sellRateUSD;
    const priceEUR = advertisement.price / sellRateEUR;

    const priceCar = new PriceCarEntity();
    priceCar.UAH = advertisement.price;
    priceCar.USD = priceUSD;
    priceCar.EUR = priceEUR;
    advertisement.priceCar = priceCar;

    await this.advertisementRepository.save(advertisement);
  }

  async setDefaultPriceCar(advertisement: AdvertisementEntity): Promise<void> {
    const priceCar = new PriceCarEntity();
    const sellRate = await this.getCurrencyRate(advertisement.currency);

    if (!sellRate)
      throw new NotFoundException('Sell rate not available for this currency.');

    const priceUAH = advertisement.price * sellRate;
    const priceUSD = priceUAH / (await this.getCurrencyRate('USD'));
    const priceEUR = priceUAH / (await this.getCurrencyRate('EUR'));

    priceCar.UAH = priceUAH;
    priceCar.USD = priceUSD;
    priceCar.EUR = priceEUR;

    advertisement.priceCar = priceCar;
    await this.advertisementRepository.save(advertisement);
  }

  async getCurrencies(): Promise<CurrencyPrivatBankEntity[]> {
    return await this.currencyRepository.find();
  }

  async getCurrencyByName(name: string): Promise<CurrencyPrivatBankEntity> {
    try {
      const currency = await this.currencyRepository.findOneBy({ name });
      if (!currency) {
        throw new NotFoundException(`Currency with name ${name} not found.`);
      }
      return currency;
    } catch (error) {
      throw new UnprocessableEntityException(
        `Error fetching currency by name: ${name}. Details: ${error.message}`,
      );
    }
  }
}
