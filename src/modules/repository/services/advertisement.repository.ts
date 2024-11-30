import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';
import { CurrencyEnum } from '../../financial/enums/cerrency.enum';

@Injectable()
export class AdvertisementRepository extends Repository<AdvertisementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementEntity, dataSource.manager);
  }

  async findFirstByTitleAndDescription(
    title: string,
    description: string,
  ): Promise<AdvertisementEntity | null> {
    return await this.createQueryBuilder(TableNameEnum.ADVERTISEMENT)
      .where('advertisement.title = :title', { title })
      .andWhere('advertisement.description = :description', { description })
      .getOne();
  }

  async findByParams(
    queryParams: Record<string, any>,
  ): Promise<AdvertisementEntity[]> {
    const query = this.createQueryBuilder(TableNameEnum.ADVERTISEMENT)
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.car`, 'car')
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.priceCar`, 'priceCar');

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (['title', 'description'].includes(key)) {
          query.andWhere(
            `${TableNameEnum.ADVERTISEMENT}.${key} ILIKE :${key}`,
            { [key]: `%${value}%` },
          );
        } else if (
          [
            'producer',
            'model',
            'year',
            'color',
            'power',
            'mileage',
            'numberDoors',
            'numberSeats',
          ].includes(key)
        ) {
          query.andWhere(`car.${key} = :${key}`, { [key]: value });
        } else {
          query.andWhere(`${TableNameEnum.ADVERTISEMENT}.${key} = :${key}`, {
            [key]: value,
          });
        }
      }
    });

    return await query.getMany();
  }

  async findByAvailableParams(
    queryParams: Record<string, any>,
  ): Promise<AdvertisementEntity[]> {
    const query = this.createQueryBuilder(TableNameEnum.ADVERTISEMENT)
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.car`, 'car')
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.priceCar`, 'priceCar')
      .where('advertisement.status = :status', { status: true });

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (['title', 'description'].includes(key)) {
          query.andWhere(
            `${TableNameEnum.ADVERTISEMENT}.${key} ILIKE :${key}`,
            {
              [key]: `%${value}%`,
            },
          );
        } else if (
          [
            'producer',
            'model',
            'year',
            'color',
            'power',
            'mileage',
            'numberDoors',
            'numberSeats',
          ].includes(key)
        ) {
          query.andWhere(`car.${key} = :${key}`, { [key]: value });
        } else {
          query.andWhere(`${TableNameEnum.ADVERTISEMENT}.${key} = :${key}`, {
            [key]: value,
          });
        }
      }
    });

    return await query.getMany();
  }

  async findAveragePriceByRegionAndProducerAndModel(
    region: string,
    producer: string,
    model: string,
    currency: CurrencyEnum,
  ): Promise<number | null> {
    const query = this.createQueryBuilder(TableNameEnum.ADVERTISEMENT)
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.car`, 'car')
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.priceCar`, 'priceCar')
      .select(
        "AVG(CASE WHEN :currency = 'UAH' THEN priceCar.UAH WHEN :currency = 'USD' THEN priceCar.USD WHEN :currency = 'EUR' THEN priceCar.EUR END)",
        'averagePrice',
      )
      .where(`${TableNameEnum.ADVERTISEMENT}.region = :region`, { region })
      .andWhere('car.producer = :producer', { producer })
      .andWhere('car.model = :model', { model })
      .setParameters({ currency });

    const result = await query.getRawOne();
    return result ? parseFloat(result.averagePrice) : null;
  }

  async findAveragePriceForUkraineByProducerAndModel(
    producer: string,
    model: string,
    currency: CurrencyEnum,
  ): Promise<number | null> {
    const query = this.createQueryBuilder(TableNameEnum.ADVERTISEMENT)
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.car`, 'car')
      .leftJoinAndSelect(`${TableNameEnum.ADVERTISEMENT}.priceCar`, 'priceCar')
      .select(
        "AVG(CASE WHEN :currency = 'UAH' THEN priceCar.UAH WHEN :currency = 'USD' THEN priceCar.USD WHEN :currency = 'EUR' THEN priceCar.EUR END)",
        'averagePrice',
      )
      .where('car.producer = :producer', { producer })
      .andWhere('car.model = :model', { model })
      .setParameters({ currency });

    const result = await query.getRawOne();
    return result ? parseFloat(result.averagePrice) : null;
  }
}
