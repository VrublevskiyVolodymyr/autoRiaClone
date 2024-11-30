import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CurrencyID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';

@Entity(TableNameEnum.CURRENCY)
export class CurrencyPrivatBankEntity {
  @PrimaryGeneratedColumn('uuid')
  id: CurrencyID;

  @Column({ name: 'ccy', type: 'varchar', length: 10 })
  name: string;

  @Column({ name: 'base_ccy', type: 'varchar', length: 10, default: 'UAH' })
  baseCurrency: string;

  @Column({ name: 'buy', type: 'decimal', precision: 10, scale: 2 })
  buyRate: number;

  @Column({ name: 'sale', type: 'decimal', precision: 10, scale: 2 })
  sellRate: number;
}
