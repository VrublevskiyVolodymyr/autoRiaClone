import { CarEntity } from '../../../database/entities/cars.entity';
import { PrivateCarResDto } from '../dto/res/private-car.res.dto';
import { PublicCarResDto } from '../dto/res/public-car.res.dto';

export class CarMapper {
  public static toPublicResponseDto(data: CarEntity): PublicCarResDto {
    return {
      id: data.id,
      producer: data.producer,
      model: data.model,
      power: data.power,
      year: data.year,
      numberDoors: data.numberDoors,
      numberSeats: data.numberSeats,
      mileage: data.mileage,
      color: data.color,
      photos: data.photos,
    };
  }

  public static toPrivateResponseDto(data: CarEntity): PrivateCarResDto {
    return {
      id: data.id,
      producer: data.producer,
      model: data.model,
      power: data.power,
      year: data.year,
      numberDoors: data.numberDoors,
      numberSeats: data.numberSeats,
      mileage: data.mileage,
      color: data.color,
      photos: data.photos,
      user_id: data.user_id,
    };
  }
}
