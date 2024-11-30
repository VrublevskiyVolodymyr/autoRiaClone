import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AdvertisementID,
  ModelID,
  ProducerID,
  RegionID,
} from '../../../common/types/entity-ids.type';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CurrencyEnum } from '../../financial/enums/cerrency.enum';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { AdvertisementViewRepository } from '../../repository/services/advertisement-view.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { ProducerRepository } from '../../repository/services/producer.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AccountTypeEnum } from '../../users/enums/account-type.enum';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { AveragePriceDto } from '../dto/average-price.dto';
import { ViewCountForAdvertisementDto } from '../dto/view-count-for-advertisement.dto';

@Injectable()
export class InfoService {
  constructor(
    private readonly advertisementViewRepository: AdvertisementViewRepository,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
    private readonly regionRepository: RegionRepository,
    private readonly modelRepository: ModelRepository,
    private readonly producerRepository: ProducerRepository,
  ) {}

  async getDailyViewCountForAdvertisement(
    advertisementId: AdvertisementID,
    userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const today = new Date();
    const viewsToday =
      await this.advertisementViewRepository.findByViewDateBetweenAndAdvertisementId(
        today,
        today,
        advertisementId,
      );
    const dailyViewCount = viewsToday.length;

    if (dailyViewCount === 0) {
      const advertisement = await this.advertisementRepository.findOneBy({
        id: advertisementId,
      });
      if (!advertisement) {
        throw new NotFoundException('Advertisement not found');
      }
    }

    return { advertisementId, viewCount: dailyViewCount };
  }

  async getWeeklyViewCountForAdvertisement(
    advertisementId: AdvertisementID,
    userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const viewsLastWeek =
      await this.advertisementViewRepository.findByViewDateAfterAndAdvertisementId(
        oneWeekAgo,
        advertisementId,
      );

    if (!viewsLastWeek.length) {
      const advertisement = await this.advertisementRepository.findBy({
        id: advertisementId,
      });
      if (!advertisement) {
        throw new NotFoundException('Advertisement not found');
      }
    }

    return { advertisementId, viewCount: viewsLastWeek.length };
  }

  async getMonthlyViewCountForAdvertisement(
    advertisementId: AdvertisementID,
    userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const viewsLastMonth =
      await this.advertisementViewRepository.findByViewDateAfterAndAdvertisementId(
        oneMonthAgo,
        advertisementId,
      );

    if (!viewsLastMonth.length) {
      const advertisement = await this.advertisementRepository.findBy({
        id: advertisementId,
      });
      if (!advertisement) {
        throw new NotFoundException('Advertisement not found');
      }
    }

    return { advertisementId, viewCount: viewsLastMonth.length };
  }

  async getAllViewCountForAdvertisement(
    advertisementId: AdvertisementID,
    userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const advertisement = await this.advertisementRepository.findOneBy({
      id: advertisementId,
    });
    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    return { advertisementId, viewCount: advertisement.views };
  }

  async getAveragePriceByRegion(
    producerId: ProducerID,
    regionId: RegionID,
    modelId: ModelID,
    currency: CurrencyEnum,
    userData: IUserData,
  ): Promise<AveragePriceDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const region = await this.regionRepository.findOneBy({ id: regionId });
    const producer = await this.producerRepository.findOneBy({
      id: producerId,
    });
    const model = await this.modelRepository.findOneBy({ id: modelId });

    const averagePrice =
      await this.advertisementRepository.findAveragePriceByRegionAndProducerAndModel(
        region.region,
        producer.producer,
        model.model,
        currency,
      );

    if (!averagePrice) {
      throw new ForbiddenException('Data not found');
    }

    return { currency, averagePrice };
  }

  async getAveragePriceForUkraine(
    producerId: ProducerID,
    modelId: ModelID,
    currency: CurrencyEnum,
    userData: IUserData,
  ): Promise<AveragePriceDto> {
    if (!(await this.isPremiumAccount(userData))) {
      throw new ForbiddenException('Buy Premium account');
    }

    const producer = await this.producerRepository.findOneBy({
      id: producerId,
    });
    const model = await this.modelRepository.findOneBy({ id: modelId });

    const averagePrice =
      await this.advertisementRepository.findAveragePriceForUkraineByProducerAndModel(
        producer.producer,
        model.model,
        currency,
      );

    if (!averagePrice) {
      throw new ForbiddenException('Data not found');
    }

    return { currency, averagePrice };
  }

  private async isPremiumAccount(userData: IUserData): Promise<boolean> {
    const email = userData.email;
    const user = await this.userRepository.findOneBy({ email });

    const isSellerWithPremium =
      user.roles.includes(UserRoleEnum.SELLER) &&
      user.accountType === AccountTypeEnum.PREMIUM;
    const isAdmin =
      user.roles.includes(UserRoleEnum.ADMIN) ||
      user.roles.includes(UserRoleEnum.MANAGER);

    return isSellerWithPremium || isAdmin;
  }
}
