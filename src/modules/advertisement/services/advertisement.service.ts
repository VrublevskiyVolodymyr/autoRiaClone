import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AdvertisementID } from '../../../common/types/entity-ids.type';
import { Config } from '../../../config/config.types';
import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { CarEntity } from '../../../database/entities/cars.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarsService } from '../../cars/services/cars.service';
import { CurrencyEnum } from '../../financial/enums/cerrency.enum';
import { CurrencyService } from '../../financial/services/currency.service';
import { ManagerService } from '../../manager/services/manager.service';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { AdvertisementViewRepository } from '../../repository/services/advertisement-view.repository';
import { CarRepository } from '../../repository/services/car.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AccountTypeEnum } from '../../users/enums/account-type.enum';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { AdvertisementQueryDto } from '../dto/req/advertisement-query.dto';
import { CreateAdvertisementByCarIdDto } from '../dto/req/create-advertisement-by-car-id.dto';
import { CreateAdvertisementWithCarDto } from '../dto/req/create-advertisement-with-car.dto';
import { UpdateAdvertisementDto } from '../dto/req/update-advertisement.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
    private readonly advertisementViewRepository: AdvertisementViewRepository,
    private readonly regionRepository: RegionRepository,
    private readonly configService: ConfigService<Config>,
    private readonly currencyService: CurrencyService,
    private readonly carRepository: CarRepository,
    private readonly managerService: ManagerService,
    private readonly carService: CarsService,
  ) {}

  async createAdvByCarId(
    advData: CreateAdvertisementByCarIdDto,
    userData: IUserData,
  ): Promise<AdvertisementEntity> {
    const existingAdvertisement =
      await this.advertisementRepository.findFirstByTitleAndDescription(
        advData.title,
        advData.description,
      );

    if (existingAdvertisement) {
      throw new ConflictException(
        `A similar advertisement already exists with ID: ${existingAdvertisement.id}`,
      );
    }

    const existingCar = await this.carRepository.findOneBy({
      id: advData.carId,
    });

    if (!existingCar) {
      throw new NotFoundException(
        `car with id ${advData.carId} not found in data base`,
      );
    }

    const user = await this.userRepository.findOneBy({ email: userData.email });
    const existAdv = await this.advertisementRepository.findOneBy({
      car: existingCar,
    });

    if (existAdv) {
      throw new ConflictException(
        `An ad with the specified carId already exists with the ID: ${existAdv.id}`,
      );
    }

    if (user.accountType === AccountTypeEnum.BASIC && user.countOfAds >= 1) {
      throw new ForbiddenException(
        'You can only post one advertisement with a basic account.',
      );
    }
    const advertisement = await this.createAdvertisement(
      advData,
      existingCar,
      user,
    );

    if (
      this.containsBannedWords(advData.title) ||
      this.containsBannedWords(advData.description)
    ) {
      await this.convertCurrency(advertisement, advData.currency);

      advertisement.status = false;
      const savedAdvertisement =
        await this.advertisementRepository.save(advertisement);
      throw new ForbiddenException(
        `Your advertisement contains banned words. Edit your message, id = ${savedAdvertisement.id}`,
      );
    }

    await this.convertCurrency(advertisement, advData.currency);

    return await this.advertisementRepository.save(advertisement);
  }

  async createAdvWithCar(
    advData: CreateAdvertisementWithCarDto,
    userData: IUserData,
  ): Promise<AdvertisementEntity> {
    const existingAdvertisement =
      await this.advertisementRepository.findFirstByTitleAndDescription(
        advData.title,
        advData.description,
      );

    if (existingAdvertisement) {
      throw new ConflictException(
        `A similar advertisement already exists with ID: ${existingAdvertisement.id}`,
      );
    }

    const newCar = this.carRepository.create({
      ...advData.car,
      user_id: userData.userId,
    });
    const savedCar = await this.carRepository.save(newCar);

    const user = await this.userRepository.findOneBy({ email: userData.email });
    const existAdv = await this.advertisementRepository.findOneBy({
      car: savedCar,
    });

    if (existAdv) {
      throw new ConflictException(
        `An ad with the specified carId already exists with the ID: ${existAdv.id}`,
      );
    }

    if (user.accountType === AccountTypeEnum.BASIC && user.countOfAds >= 1) {
      throw new ForbiddenException(
        'You can only post one advertisement with a basic account.',
      );
    }
    const advertisement = await this.createAdvertisement(
      advData,
      savedCar,
      user,
    );

    if (
      this.containsBannedWords(advData.title) ||
      this.containsBannedWords(advData.description)
    ) {
      await this.convertCurrency(advertisement, advData.currency);

      advertisement.status = false;
      const savedAdvertisement =
        await this.advertisementRepository.save(advertisement);
      throw new ForbiddenException(
        `Your advertisement contains banned words. Edit your message, id = ${savedAdvertisement.id}`,
      );
    }

    await this.convertCurrency(advertisement, advData.currency);

    return await this.advertisementRepository.save(advertisement);
  }

  async createAdvWithCarPhoto(
    advData: CreateAdvertisementWithCarDto,
    userData: IUserData,
    photos: Express.Multer.File[],
  ) {
    const existingAdvertisement =
      await this.advertisementRepository.findFirstByTitleAndDescription(
        advData.title,
        advData.description,
      );

    if (existingAdvertisement) {
      throw new ConflictException(
        `A similar advertisement already exists with ID: ${existingAdvertisement.id}`,
      );
    }

    const savedCar = await this.carService.createCarWithPhoto(
      advData.car,
      userData,
      photos,
    );

    const user = await this.userRepository.findOneBy({ email: userData.email });
    const existAdv = await this.advertisementRepository.findOneBy({
      car: savedCar,
    });

    if (existAdv) {
      throw new ConflictException(
        `An ad with the specified carId already exists with the ID: ${existAdv.id}`,
      );
    }

    if (user.accountType === AccountTypeEnum.BASIC && user.countOfAds >= 1) {
      throw new ForbiddenException(
        'You can only post one advertisement with a basic account.',
      );
    }
    const advertisement = await this.createAdvertisement(
      advData,
      savedCar,
      user,
    );

    if (
      this.containsBannedWords(advData.title) ||
      this.containsBannedWords(advData.description)
    ) {
      await this.convertCurrency(advertisement, advData.currency);

      advertisement.status = false;
      const savedAdvertisement =
        await this.advertisementRepository.save(advertisement);
      throw new ForbiddenException(
        `Your advertisement contains banned words. Edit your message, id = ${savedAdvertisement.id}`,
      );
    }

    await this.convertCurrency(advertisement, advData.currency);

    return await this.advertisementRepository.save(advertisement);
  }

  private async createAdvertisement(
    advertisementDTO:
      | CreateAdvertisementByCarIdDto
      | CreateAdvertisementWithCarDto,
    car: CarEntity,
    user: UserEntity,
  ): Promise<AdvertisementEntity> {
    const advertisement = new AdvertisementEntity();
    const regionExists = await this.regionRepository.isRegionExist(
      advertisementDTO.region,
    );

    if (!regionExists) {
      throw new NotFoundException('region not found in data base');
    }
    const region = (
      await this.regionRepository.findOneBy({ region: advertisementDTO.region })
    )?.region;

    advertisement.title = advertisementDTO.title;
    advertisement.description = advertisementDTO.description;
    advertisement.currency = advertisementDTO.currency;
    advertisement.price = advertisementDTO.price;
    advertisement.car = car;
    advertisement.status = true;
    advertisement.user_id = user.id;
    advertisement.region = region;
    advertisement.user = user;

    user.countOfAds += 1;
    await this.userRepository.save(user);

    return advertisement;
  }

  async editAdvertisement(
    id: AdvertisementID,
    advertisementData: UpdateAdvertisementDto,
    userData: IUserData,
  ): Promise<AdvertisementEntity> {
    const user = await this.userRepository.findOneBy({
      email: userData.email,
    });

    const existingAdvertisement = await this.advertisementRepository.findOne({
      where: { id },
    });
    if (!existingAdvertisement)
      throw new NotFoundException('Invalid advertisement id');

    const idCreatedBy = existingAdvertisement.user_id;
    const idUser = user.id;
    const roles = user.roles;

    if (
      idUser !== idCreatedBy &&
      !roles.includes(UserRoleEnum.ADMIN) &&
      !roles.includes(UserRoleEnum.MANAGER)
    ) {
      throw new ForbiddenException('You cannot edit this advertisement');
    }

    if (
      existingAdvertisement.editCount >= 3 &&
      !roles.includes(UserRoleEnum.ADMIN) &&
      !roles.includes(UserRoleEnum.MANAGER)
    ) {
      throw new ForbiddenException(
        `Your advertisement id = ${id} is banned, contact the administrator`,
      );
    }

    if (
      this.containsBannedWords(advertisementData.title) ||
      this.containsBannedWords(advertisementData.description)
    ) {
      existingAdvertisement.editCount += 1;
      existingAdvertisement.status = false;

      await this.advertisementRepository.save(existingAdvertisement);

      const remainingAttempts = 3 - existingAdvertisement.editCount;

      if (
        remainingAttempts === 0 &&
        !roles.includes(UserRoleEnum.ADMIN) &&
        !roles.includes(UserRoleEnum.MANAGER)
      ) {
        await this.managerService.notifyBannedAdvertisement(
          JSON.stringify(existingAdvertisement),
          userData,
        );
        throw new ForbiddenException(
          `Your advertisement id = ${id} is banned, contact the administrator`,
        );
      }

      throw new ForbiddenException(
        `Your advertisement contains banned words. Edit your message, id = ${id}. You have ${remainingAttempts} tries.`,
      );
    }

    const regionExists = await this.regionRepository.isRegionExist(
      advertisementData.region,
    );

    if (!regionExists) {
      throw new NotFoundException('region not found in data base');
    }
    const region = (
      await this.regionRepository.findOneBy({
        region: advertisementData.region,
      })
    )?.region;

    existingAdvertisement.title = advertisementData.title;
    existingAdvertisement.description = advertisementData.description;
    existingAdvertisement.region = region;
    existingAdvertisement.editCount += 1;
    existingAdvertisement.status = true;

    if (advertisementData.price) {
      existingAdvertisement.price = advertisementData.price;
      existingAdvertisement.currency = advertisementData.currency;

      await this.convertCurrency(
        existingAdvertisement,
        advertisementData.currency,
      );
    }

    return await this.advertisementRepository.save(existingAdvertisement);
  }

  async getAdvertisementByParams(
    query: AdvertisementQueryDto,
  ): Promise<AdvertisementEntity[]> {
    return await this.advertisementRepository.findByParams(query);
  }

  async getAdvertisementById(id: AdvertisementID, userData: IUserData) {
    const advertisement = await this.advertisementRepository.findOneBy({ id });
    if (!advertisement) {
      throw new NotFoundException(`Advertisement not found in the database!`);
    }
    const user = await this.userRepository.findOneBy({ email: userData.email });
    const is_owner = advertisement.user_id === user.id;
    const is_admin =
      user.roles.includes(UserRoleEnum.ADMIN) ||
      user.roles.includes(UserRoleEnum.MANAGER);

    advertisement.views += 1;
    await this.advertisementRepository.save(advertisement);

    const view = this.advertisementViewRepository.create({
      advertisement,
      view_date: new Date(),
      viewer_user_id: user.id,
      advertisement_id: advertisement.id,
      is_owner,
      is_admin,
    });

    await this.advertisementViewRepository.save(view);

    return advertisement;
  }

  async getAvailableAdvertisementByParams(query: AdvertisementQueryDto) {
    return await this.advertisementRepository.findByAvailableParams(query);
  }

  async getAvailableAdvertisementById(
    id: AdvertisementID,
    userData: IUserData,
  ) {
    const advertisement = await this.advertisementRepository.findOneBy({
      id,
      status: true,
    });

    if (!advertisement) {
      throw new NotFoundException(`Advertisement not found in the database!`);
    }
    const user = await this.userRepository.findOneBy({ email: userData.email });
    const is_owner = advertisement.user_id === user.id;
    const is_admin =
      user.roles.includes(UserRoleEnum.ADMIN) ||
      user.roles.includes(UserRoleEnum.MANAGER);

    advertisement.views += 1;
    await this.advertisementRepository.save(advertisement);

    const view = this.advertisementViewRepository.create({
      advertisement,
      view_date: new Date(),
      viewer_user_id: user.id,
      advertisement_id: advertisement.id,
      is_owner,
      is_admin,
    });

    await this.advertisementViewRepository.save(view);

    return advertisement;
  }

  async deleteAdvertisementById(
    id: AdvertisementID,
    userData: IUserData,
  ): Promise<void> {
    const advertisement = await this.advertisementRepository.findOneBy({ id });
    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    const user = await this.userRepository.findOneBy({ email: userData.email });

    const isAdmin =
      user.roles.includes(UserRoleEnum.ADMIN) ||
      user.roles.includes(UserRoleEnum.MANAGER);
    const isSeller = user.roles.includes(UserRoleEnum.SELLER);
    const isOwner = advertisement.user_id === user.id;

    if (isAdmin || (isSeller && isOwner)) {
      try {
        await this.advertisementRepository.delete(advertisement.id);
        return;
      } catch (error) {
        throw new BadRequestException('Failed to delete advertisement');
      }
    }

    throw new ForbiddenException('You cannot delete this advertisement');
  }

  private containsBannedWords(text: string): boolean {
    const bannedWords = ['spam', 'banned', 'prohibited', 'bad'];
    return bannedWords.some((word) => text.includes(word));
  }

  private async convertCurrency(
    advertisement: AdvertisementEntity,
    currency: CurrencyEnum,
  ): Promise<void> {
    if (currency === CurrencyEnum.UAH) {
      await this.currencyService.convertCurrency(advertisement);
    } else {
      await this.currencyService.setDefaultPriceCar(advertisement);
    }
  }
}
