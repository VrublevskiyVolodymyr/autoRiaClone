import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegionID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';

@Entity(TableNameEnum.REGIONS)
export class RegionEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: RegionID;

  @Column({ type: 'text' })
  region: string;
}
