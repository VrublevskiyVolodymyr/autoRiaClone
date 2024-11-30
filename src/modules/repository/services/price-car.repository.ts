import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PriceCarEntity } from '../../../database/entities/price-car.entity';

@Injectable()
export class PriceCarRepository extends Repository<PriceCarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PriceCarEntity, dataSource.manager);
  }
}
