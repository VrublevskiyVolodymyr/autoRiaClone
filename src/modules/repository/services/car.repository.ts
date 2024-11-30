import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarID } from '../../../common/types/entity-ids.type';
import { CarEntity } from '../../../database/entities/cars.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';
import { UpdateCarDto } from '../../cars/dto/req/update-car.dto';

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async updateById(
    carId: CarID,
    dto: Partial<UpdateCarDto>,
  ): Promise<CarEntity> {
    await this.update(carId, dto);
    return await this.findOneOrFail({ where: { id: carId } });
  }

  public async findByParams(
    queryParams: Record<string, any>,
  ): Promise<CarEntity[]> {
    const query = this.createQueryBuilder(TableNameEnum.CARS);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        query.andWhere(`${TableNameEnum.CARS}.${key} = :${key}`, {
          [key]: value,
        });
      }
    });

    return await query.getMany();
  }

  public async isCarExist(id: CarID): Promise<boolean> {
    return await this.exists({ where: { id } });
  }

  public async addPhotosToCar(
    carId: CarID,
    newPhotos: string[],
  ): Promise<void> {
    const car = await this.findOneOrFail({ where: { id: carId } });
    car.photos = [...(car.photos || []), ...newPhotos];
    await this.save(car);
  }
}
