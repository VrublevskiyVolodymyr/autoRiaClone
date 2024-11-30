import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OldPasswordID, UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.OLD_PASSWORD)
export class OldPasswordEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: OldPasswordID;

  @Column('text')
  password: string;

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.oldPasswords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
