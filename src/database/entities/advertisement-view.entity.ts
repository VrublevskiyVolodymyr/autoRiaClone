import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  AdvertisementID,
  UserID,
  ViewID,
} from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { AdvertisementEntity } from './advertisement.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.VIEW)
export class AdvertisementViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: ViewID;

  @Column()
  advertisement_id: AdvertisementID;

  @ManyToOne(
    () => AdvertisementEntity,
    (advertisement) => advertisement.advertisementViews,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinTable({
    name: 'adv_view',
    joinColumn: { name: 'view_id' },
  })
  advertisement: AdvertisementEntity;

  @Column({ type: 'date' })
  view_date: Date;

  @Column()
  viewer_user_id: UserID;

  @Column({ type: 'boolean' })
  is_owner: boolean;

  @Column({ type: 'boolean' })
  is_admin: boolean;
}
