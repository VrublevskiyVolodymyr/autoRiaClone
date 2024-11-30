import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdvertisementID, UserID } from '../../common/types/entity-ids.type';
import { CurrencyEnum } from '../../modules/financial/enums/cerrency.enum';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { AdvertisementViewEntity } from './advertisement-view.entity';
import { CarEntity } from './cars.entity';
import { PriceCarEntity } from './price-car.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.ADVERTISEMENT)
export class AdvertisementEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: AdvertisementID;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  status: boolean;

  @OneToOne(() => CarEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'car_id' })
  car: CarEntity;

  @Column({ type: 'text' })
  region: string;

  @OneToOne(() => PriceCarEntity, { cascade: true, eager: true })
  @JoinColumn()
  priceCar: PriceCarEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column()
  user_id: UserID;

  @ManyToOne(() => UserEntity, (entity) => entity.advertisements, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'seller_adv',
    joinColumn: { name: 'adv_id' },
  })
  user: UserEntity;

  @Column({ default: 0 })
  editCount: number;

  @Exclude()
  @OneToMany(() => AdvertisementViewEntity, (view) => view.advertisement, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'adv_view',
    joinColumn: { name: 'adv_id' },
  })
  advertisementViews: AdvertisementViewEntity[];
}
