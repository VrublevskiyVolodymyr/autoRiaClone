import { Expose } from 'class-transformer';
import { IsDecimal } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PriceCarID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';

@Entity(TableNameEnum.PRICECAR)
export class PriceCarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: PriceCarID;

  @Expose({ name: 'UAH' })
  @IsDecimal({ decimal_digits: '0,2' })
  @Column('decimal', { precision: 10, scale: 2 })
  UAH: number;

  @Expose({ name: 'USD' })
  @IsDecimal({ decimal_digits: '0,2' })
  @Column('decimal', { precision: 10, scale: 2 })
  USD: number;

  @Expose({ name: 'EUR' })
  @IsDecimal({ decimal_digits: '0,2' })
  @Column('decimal', { precision: 10, scale: 2 })
  EUR: number;
}
