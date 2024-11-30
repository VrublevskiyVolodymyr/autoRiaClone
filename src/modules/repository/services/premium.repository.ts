import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserID } from '../../../common/types/entity-ids.type';
import { PremiumPurchaseEntity } from '../../../database/entities/premium-purchase.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';

@Injectable()
export class PremiumPurchaseRepository extends Repository<PremiumPurchaseEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PremiumPurchaseEntity, dataSource.manager);
  }
  public async findPremiumPurchaseByUserId(
    userId: UserID,
  ): Promise<PremiumPurchaseEntity | null> {
    return await this.createQueryBuilder(TableNameEnum.PREMIUM)
      .leftJoinAndSelect('premium.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
