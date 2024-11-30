import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ProducerEntity } from '../../../database/entities/producer.entity';

@Injectable()
export class ProducerRepository extends Repository<ProducerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProducerEntity, dataSource.manager);
  }

  public async isProducerExist(producer: string): Promise<boolean> {
    return await this.exists({ where: { producer } });
  }
}
