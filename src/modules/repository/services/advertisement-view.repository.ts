import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisementID } from '../../../common/types/entity-ids.type';
import { AdvertisementViewEntity } from '../../../database/entities/advertisement-view.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';

@Injectable()
export class AdvertisementViewRepository extends Repository<AdvertisementViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementViewEntity, dataSource.manager);
  }

  async findByViewDateBetweenAndAdvertisementId(
    startDate: Date,
    endDate: Date,
    advertisementId: AdvertisementID,
  ) {
    return await this.createQueryBuilder(TableNameEnum.VIEW)
      .where(
        `${TableNameEnum.VIEW}.view_date BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      )
      .andWhere(`${TableNameEnum.VIEW}.advertisement_id = :advertisementId`, {
        advertisementId,
      })
      .getMany();
  }

  async findByViewDateAfterAndAdvertisementId(
    startDate: Date,
    advertisementId: AdvertisementID,
  ) {
    return await this.createQueryBuilder(TableNameEnum.VIEW)
      .where(`${TableNameEnum.VIEW}.view_date > :startDate`, { startDate })
      .andWhere(`${TableNameEnum.VIEW}.advertisement_id = :advertisementId`, {
        advertisementId,
      })
      .getMany();
  }
}
