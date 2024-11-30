import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ModelID, ProducerID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { ProducerEntity } from './producer.entity';

@Entity(TableNameEnum.MODELS)
export class ModelEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: ModelID;

  @Column()
  model: string;

  @Column()
  producer_id: ProducerID;

  @ManyToOne(() => ProducerEntity, (entity) => entity.models, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producer_id' })
  producer?: ProducerEntity;
}
