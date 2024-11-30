import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PremiumID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.PREMIUM)
export class PremiumPurchaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: PremiumID;

  @Column()
  orderId: string;

  @OneToOne(() => UserEntity, { cascade: true, eager: true })
  @JoinColumn()
  user: UserEntity;
}
