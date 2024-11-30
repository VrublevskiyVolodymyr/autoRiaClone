import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { PriceCarEntity } from '../../../database/entities/price-car.entity';
import { PriceCarDto } from '../../cars/dto/res/price-car.dto';
import { CarMapper } from '../../cars/mappers/car.mapper';
import { AdvertisementPrivateResDto } from '../dto/res/private-advertisement.res';
import { PublicAdvertisementResDto } from '../dto/res/public-advertisement.res.dto';

export class AdvertisementMapper {
  public static toPublicResponseDto(
    data: AdvertisementEntity,
  ): PublicAdvertisementResDto {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      region: data.region,
      price: data.price,
      currency: data.currency,
      car: data.car ? CarMapper.toPublicResponseDto(data.car) : null,
      priceCar: data.priceCar ? this.toPublicPriceCar(data.priceCar) : null,
    };
  }

  public static toPrivateResponseDto(
    data: AdvertisementEntity,
  ): AdvertisementPrivateResDto {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      region: data.region,
      price: data.price,
      currency: data.currency,
      priceCar: data.priceCar,
      views: data.views,
      status: data.status,
      editCount: data.editCount,
      car: data.car,
      user_id: data.user_id,
    };
  }

  private static toPublicPriceCar(data: PriceCarEntity): PriceCarDto {
    return {
      EUR: data.EUR,
      UAH: data.UAH,
      USD: data.USD,
    };
  }
}
