import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DealershipID, UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.DEALERSHIPS)
export class DealershipEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: DealershipID;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => UserEntity, (user) => user.dealership)
  employees: UserEntity[];
}
