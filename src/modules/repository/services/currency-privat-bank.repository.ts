import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CurrencyPrivatBankEntity } from '../../../database/entities/currency-privat-bank.entity';

@Injectable()
export class CurrencyPrivatBankRepository extends Repository<CurrencyPrivatBankEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CurrencyPrivatBankEntity, dataSource.manager);
  }
}
