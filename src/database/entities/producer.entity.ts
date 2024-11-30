import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProducerID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { ModelEntity } from './model.entity';

@Entity(TableNameEnum.PRODUCERS)
export class ProducerEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: ProducerID;

  @Column({ unique: true })
  producer: string;

  @OneToMany(() => ModelEntity, (entity) => entity.producer)
  models: ModelEntity[];
}
