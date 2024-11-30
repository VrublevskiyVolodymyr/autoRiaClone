import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OldPasswordEntity } from '../../../database/entities/old-password.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';

@Injectable()
export class OldPasswordRepository extends Repository<OldPasswordEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OldPasswordEntity, dataSource.manager);
  }

  public async findByParams(userId: string): Promise<OldPasswordEntity[]> {
    return await this.createQueryBuilder(TableNameEnum.OLD_PASSWORD)
      .where(`${TableNameEnum.OLD_PASSWORD}.user_id = :userId`, { userId })
      .getMany();
  }
}
