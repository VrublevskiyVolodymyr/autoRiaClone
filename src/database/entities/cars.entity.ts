import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarID, UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.CARS)
export class CarEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: CarID;

  @Column({ type: 'text', nullable: false })
  producer: string;

  @Column({ type: 'text', nullable: false })
  model: string;

  @Column({ type: 'text', nullable: false })
  power: number;

  @Column({ type: 'text', nullable: false })
  year: number;

  @Column({ type: 'text', nullable: false })
  color: string;

  @Column({ type: 'text', nullable: false })
  mileage: number;

  @Column({ type: 'text', nullable: false })
  numberDoors: number;

  @Column({ type: 'text', nullable: false })
  numberSeats: number;

  @Column('text', { array: true, nullable: true })
  photos: string[];

  // @OneToOne(() => Advertisement, { cascade: true, eager: true })
  // @JoinColumn({ name: 'advertisement_id', referencedColumnName: 'id' })
  // advertisement: Advertisement;

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.cars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
