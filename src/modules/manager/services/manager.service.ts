import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ModelID,
  ProducerID,
  RegionID,
  UserID,
} from '../../../common/types/entity-ids.type';
import { Config, ManagerConfig } from '../../../config/config.types';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { EmailService } from '../../email/email.service';
import { EmailTypeEnum } from '../../email/enums/email-type.enum';
import { ModelRepository } from '../../repository/services/model.repository';
import { ProducerRepository } from '../../repository/services/producer.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ListModelsDto } from '../dto/req/listModels.dto';
import { ListProducersDto } from '../dto/req/listProducers.dto';
import { ListRegionsDto } from '../dto/req/listRegions.dto';

@Injectable()
export class ManagerService {
  private readonly managerConfig: ManagerConfig;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly producerRepository: ProducerRepository,
    private readonly modelRepository: ModelRepository,
    private readonly regionRepository: RegionRepository,
    private readonly configService: ConfigService<Config>,
    private readonly emailService: EmailService,
  ) {
    this.managerConfig = this.configService.get<ManagerConfig>('manager');
  }

  public async banUser(userId: UserID) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.merge(user, { is_active: false });
    return await this.userRepository.save(user);
  }

  public async unbanUser(userId: UserID) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.merge(user, { is_active: true });
    return await this.userRepository.save(user);
  }

  async notifyMissingProducer(
    producer: string,
    userData: IUserData,
  ): Promise<void> {
    const producerExists = await this.producerRepository.isProducerExist(
      this.capitalizeFirstLetter(producer),
    );

    if (producerExists) {
      throw new ConflictException(`Producer ${producer} already exist!`);
    }

    const managerEmail = this.managerConfig.managerEmail;
    const user = await this.userRepository.findOneBy({ email: userData.email });

    await this.emailService.sendEmail(
      EmailTypeEnum.NOTIFY_MISSING_PRODUCER,
      managerEmail,
      {
        item: producer,
        name: `${user.firstName} ${user.lastName}`,
      },
    );

    await this.emailService.sendEmail(
      EmailTypeEnum.REPORT_PRODUCER_RECEIVED,
      userData.email,
      {
        item: producer,
        name: user.firstName,
        frontUrl: this.managerConfig.frontUrl,
      },
    );
  }

  async notifyMissingModel(
    producer: string,
    model: string,
    userData: IUserData,
  ) {
    const producerExists = await this.producerRepository.isProducerExist(
      this.capitalizeFirstLetter(producer),
    );

    if (!producerExists) {
      throw new NotFoundException(`Producer ${producer} does not exist!`);
    }

    const modelExists = await this.modelRepository.isModelExist(
      this.capitalizeFirstLetter(model),
    );

    if (modelExists) {
      throw new ConflictException(`Model ${model} already exist!`);
    }

    const managerEmail = this.managerConfig.managerEmail;
    const user = await this.userRepository.findOneBy({ email: userData.email });

    await this.emailService.sendEmail(
      EmailTypeEnum.NOTIFY_MISSING_MODEL,
      managerEmail,
      {
        item: model,
        name: `${user.firstName} ${user.lastName}`,
      },
    );

    await this.emailService.sendEmail(
      EmailTypeEnum.REPORT_MODEL_RECEIVED,
      userData.email,
      {
        item: model,
        name: user.firstName,
        frontUrl: this.managerConfig.frontUrl,
      },
    );
  }

  async notifyBannedAdvertisement(advertisement: string, userData: IUserData) {
    const managerEmail = this.managerConfig.managerEmail;
    const user = await this.userRepository.findOneBy({ email: userData.email });

    await this.emailService.sendEmail(
      EmailTypeEnum.NOTIFY_BANNED_ADVERTISEMENT,
      managerEmail,
      {
        advertisement,
        name: `${user.firstName} ${user.lastName}`,
      },
    );
  }

  capitalizeFirstLetter(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  async addProducers(producers: ListProducersDto) {
    if (producers) {
      for (const producer of producers.producers) {
        const isProducerExist = await this.producerRepository.isProducerExist(
          this.capitalizeFirstLetter(producer),
        );
        if (!isProducerExist) {
          const newProducer = this.producerRepository.create({
            producer: this.capitalizeFirstLetter(producer),
          });
          await this.producerRepository.save(newProducer);
        }
      }
    }
    return await this.producerRepository.find();
  }

  async addModels(models: ListModelsDto) {
    const producerEntity = await this.producerRepository.findOne({
      where: { producer: this.capitalizeFirstLetter(models.producer) },
    });

    if (!producerEntity) {
      throw new NotFoundException(
        `Producer ${models.producer} not found in the database!`,
      );
    }

    for (const model of models.models) {
      const isModelExist = await this.modelRepository.isModelExist(
        this.capitalizeFirstLetter(model),
      );

      if (!isModelExist) {
        const newModel = this.modelRepository.create({
          model: this.capitalizeFirstLetter(model),
          producer: producerEntity,
        });

        await this.modelRepository.save(newModel);
      }
    }

    return await this.modelRepository.find({
      where: { producer: producerEntity },
    });
  }

  async addRegions(regions: ListRegionsDto) {
    if (regions) {
      for (const region of regions.regions) {
        const isRegionExist = await this.regionRepository.isRegionExist(
          this.capitalizeFirstLetter(region),
        );
        if (!isRegionExist) {
          const newRegion = this.regionRepository.create({
            region: this.capitalizeFirstLetter(region),
          });
          await this.regionRepository.save(newRegion);
        }
      }
    }
    return await this.regionRepository.find();
  }

  async removeProducerById(id: ProducerID) {
    const producerEntity = await this.producerRepository.findOneBy({ id });
    if (!producerEntity) {
      throw new NotFoundException(`Producer does not exist!`);
    }
    await this.producerRepository.delete(producerEntity);
    return;
  }

  async removeModelById(id: ModelID) {
    const modelEntity = await this.modelRepository.findOneBy({ id });
    if (!modelEntity) {
      throw new NotFoundException(`Model does not exist!`);
    }
    await this.modelRepository.delete(modelEntity);
    return;
  }

  async removeRegionById(id: RegionID) {
    const regionEntity = await this.regionRepository.findOneBy({ id });
    if (!regionEntity) {
      throw new NotFoundException(`Region does not exist!`);
    }
    await this.regionRepository.delete(regionEntity);
    return;
  }
}
