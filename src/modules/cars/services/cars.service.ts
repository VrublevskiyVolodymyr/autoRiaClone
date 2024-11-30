import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CarID,
  ModelID,
  ProducerID,
  RegionID,
} from '../../../common/types/entity-ids.type';
import { AwsConfig, Config } from '../../../config/config.types';
import { CarEntity } from '../../../database/entities/cars.entity';
import { ContentType } from '../../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../../file-storage/services/file-storage.service';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { ProducerRepository } from '../../repository/services/producer.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { CarQueryDto } from '../dto/req/car-query.dto';
import { CreateCarDto } from '../dto/req/create-car.dto';
import { UpdateCarDto } from '../dto/req/update-car.dto';

@Injectable()
export class CarsService {
  private readonly awsConfig: AwsConfig;
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly modelRepository: ModelRepository,
    private readonly regionRepository: RegionRepository,
    private readonly carRepository: CarRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AwsConfig>('aws');
  }

  async createCar(
    carData: CreateCarDto,
    userData: IUserData,
  ): Promise<CarEntity> {
    const isProducerExist = await this.producerRepository.isProducerExist(
      carData.producer,
    );

    if (!isProducerExist) {
      throw new NotFoundException(`Producer not found in the database!`);
    }

    const isModelExist = await this.modelRepository.isModelExist(carData.model);
    if (!isModelExist) {
      throw new NotFoundException(`Model not found in the database!`);
    }

    const newCar = this.carRepository.create({
      ...carData,
      user_id: userData.userId,
    });
    return await this.carRepository.save(newCar);
  }

  async getCarById(id: CarID): Promise<CarEntity> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) {
      throw new NotFoundException(`Car not found in the database!`);
    }
    const photos = car.photos
      ? car.photos.map((photo) =>
          photo ? `${this.awsConfig.bucketUrl}/${photo}` : null,
        )
      : [];
    return {
      ...car,
      photos,
    };
  }

  async getCarsByParams(query: CarQueryDto): Promise<CarEntity[]> {
    const cars = await this.carRepository.findByParams(query);
    const mappedCars = cars.map((car) => {
      return {
        ...car,
        photos: car.photos
          ? car.photos.map((photo) =>
              photo ? `${this.awsConfig.bucketUrl}/${photo}` : null,
            )
          : [],
      };
    });
    return mappedCars;
  }

  async updateCarById(dto: UpdateCarDto, carId: CarID): Promise<CarEntity> {
    const isCarExist = await this.carRepository.isCarExist(carId);
    if (!isCarExist) {
      throw new NotFoundException(`Car not found in the database!`);
    }
    return await this.carRepository.updateById(carId, dto);
  }

  async deleteCarById(id: CarID): Promise<void> {
    const isCarExist = await this.carRepository.isCarExist(id);
    if (!isCarExist) {
      throw new NotFoundException(`Car not found in the database!`);
    }
    await this.carRepository.delete(id);
  }

  async getProducers() {
    return await this.producerRepository.find();
  }

  async getModels() {
    return await this.modelRepository.find();
  }

  async getRegions() {
    return await this.regionRepository.find();
  }

  async getProducerById(id: ProducerID) {
    const producerEntity = await this.producerRepository.findOneBy({ id });
    if (!producerEntity) {
      throw new NotFoundException(`Producer not found in the database!`);
    }
    return producerEntity;
  }

  async getModelById(id: ModelID) {
    const modelEntity = await this.modelRepository.findOneBy({ id });
    if (!modelEntity) {
      throw new NotFoundException(`Model not found in the database!`);
    }
    return modelEntity;
  }

  async getRegionById(id: RegionID) {
    const regionEntity = await this.regionRepository.findOneBy({ id });
    if (!regionEntity) {
      throw new NotFoundException(`Region not found in the database!`);
    }
    return regionEntity;
  }

  async getModelsByProducerId(id: ProducerID) {
    const producerEntity = await this.producerRepository.findOneBy({ id });
    if (!producerEntity) {
      throw new NotFoundException(`Producer not found in the database!`);
    }
    return await this.modelRepository.findBy({ producer_id: id });
  }

  async uploadPhotos(
    carId: CarID,
    photos: Express.Multer.File[],
  ): Promise<void> {
    const images = await this.fileStorageService.uploadFiles(
      photos,
      ContentType.PHOTOS,
      carId,
    );

    await this.carRepository.addPhotosToCar(carId, images);
  }

  public async deletePhoto(carId: CarID, fullUrl: string): Promise<void> {
    const car = await this.carRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException(`Car not found in the database!`);
    }
    if (car.photos) {
      const photoPath = fullUrl
        .replace(`${this.awsConfig.bucketUrl}/`, '')
        .replace(/"/g, '')
        .trim();

      const photo = car.photos.find(
        (photo) => photo.trim() === photoPath.trim(),
      );
      if (!photo) {
        throw new NotFoundException(`Photo not found in the database!`);
      }
      car.photos = car.photos.filter(
        (photo) => photo.trim() !== photoPath.trim(),
      );
      await this.fileStorageService.deleteFile(photoPath);
      await this.carRepository.save(car);
    }
  }

  async createCarWithPhoto(
    carData: CreateCarDto,
    userData: IUserData,
    photos: Express.Multer.File[],
  ): Promise<CarEntity> {
    const isProducerExist = await this.producerRepository.isProducerExist(
      carData.producer,
    );
    if (!isProducerExist) {
      throw new NotFoundException(`Producer not found in the database!`);
    }

    const isModelExist = await this.modelRepository.isModelExist(carData.model);
    if (!isModelExist) {
      throw new NotFoundException(`Model not found in the database!`);
    }

    const newCar = this.carRepository.create({
      ...carData,
      user_id: userData.userId,
    });

    const savedCar = await this.carRepository.save(newCar);

    if (photos && photos.length > 0) {
      const images = await this.fileStorageService.uploadFiles(
        photos,
        ContentType.PHOTOS,
        savedCar.id,
      );
      await this.carRepository.addPhotosToCar(savedCar.id, images);
    }
    return await this.carRepository.findOneBy({ id: savedCar.id });
  }
}
