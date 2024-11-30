import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { CurrencyPrivatDto } from './dto/currency-privat.dto';
import { CurrencyReqEnum } from './enums/cerrency.enum';
import { CurrencyMapper } from './mappers/currency.mapper';
import { CurrencyService } from './services/currency.service';

@ApiTags('Currency')
@Controller('currency')
export class FinancialController {
  constructor(private readonly currencyService: CurrencyService) {}

  @SkipAuth()
  @ApiOperation({
    summary: 'Get all currencies',
    description:
      'Fetches a list of all available currencies with their current exchange rates.',
  })
  @ApiConflictResponse({ description: 'Conflict' })
  @Get()
  public async getCurrencies(): Promise<CurrencyPrivatDto[]> {
    const result = await this.currencyService.getCurrencies();
    return result.map((currency) => CurrencyMapper.toCurrencyDto(currency));
  }

  @SkipAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiParam({
    name: 'name',
    enum: CurrencyReqEnum,
  })
  @ApiOperation({
    summary: 'Get currency by name',
    description:
      'Fetches exchange rate details for a specific currency based on its name.',
  })
  @Get(':name')
  public async getCurrencyByName(
    @Param('name') name: CurrencyReqEnum,
  ): Promise<CurrencyPrivatDto> {
    const result = await this.currencyService.getCurrencyByName(name);
    return CurrencyMapper.toCurrencyDto(result);
  }
}
