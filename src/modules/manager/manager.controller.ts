import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ModelID,
  ProducerID,
  RegionID,
  UserID,
} from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ModelMapper } from '../cars/mappers/model.mapper';
import { ProducerMapper } from '../cars/mappers/producer.mapper';
import { RegionMapper } from '../cars/mappers/region.mapper';
import { AdminUserResDto } from '../users/dto/res/admin-user.dto';
import { UserMapper } from '../users/user.mapper';
import { ListModelsDto } from './dto/req/listModels.dto';
import { ListProducersDto } from './dto/req/listProducers.dto';
import { ListRegionsDto } from './dto/req/listRegions.dto';
import { ModelResDto } from './dto/res/model.res.dto';
import { ProducerResDto } from './dto/res/producer.res.dto';
import { RegionResDto } from './dto/res/region.res.dto';
import { ManagerService } from './services/manager.service';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Ban a user',
    description:
      'Marks a user as banned in the system by their unique identifier (UUID). Only accessible by admin or manager roles.',
  })
  @Patch('ban/:userId')
  public async bunUser(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<AdminUserResDto> {
    const result = await this.managerService.banUser(userId);
    return UserMapper.toAdminResponseDTO(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Unban a user',
    description:
      'Removes the ban status of a user in the system by their unique identifier (UUID). Only accessible by admin or manager roles.',
  })
  @Patch('unban/:userId')
  public async unBunUser(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<AdminUserResDto> {
    const result = await this.managerService.unbanUser(userId);
    return UserMapper.toAdminResponseDTO(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Notify about a missing producer',
    description:
      'Allows the current user to report a missing producer in the system by specifying the producer name. Accessible by admin, manager, and seller roles.',
  })
  @Post('notify/producer/:producer')
  public async notifyMissingProducer(
    @CurrentUser() userData: IUserData,
    @Param('producer')
    producer: string,
  ): Promise<void> {
    return await this.managerService.notifyMissingProducer(producer, userData);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Notify about a missing model',
    description:
      'Allows the current user to report a missing model associated with a producer in the system. Requires the producer and model names. Accessible by admin, manager, and seller roles.',
  })
  @Post('notify/producer/:producer/model/:model')
  public async notifyMissingModel(
    @CurrentUser() userData: IUserData,
    @Param('producer') producer: string,
    @Param('model') model: string,
  ): Promise<void> {
    return await this.managerService.notifyMissingModel(
      producer,
      model,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Add new producers',
    description:
      'Adds a list of new producers to the system. Only accessible by admin or manager roles.',
  })
  @Post('producers')
  public async addProducers(
    @Body() producers: ListProducersDto,
  ): Promise<ProducerResDto[]> {
    const result = await this.managerService.addProducers(producers);
    return result.map((producer) => ProducerMapper.toResponseDTO(producer));
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Add new models',
    description:
      'Adds a list of new models to the system. Each model is associated with a producer. Only accessible by admin or manager roles.',
  })
  @Post('models')
  public async addModels(
    @Body() models: ListModelsDto,
  ): Promise<ModelResDto[]> {
    const result = await this.managerService.addModels(models);
    return result.map((model) => ModelMapper.toResponseDTO(model));
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Add new regions',
    description:
      'Adds a list of new regions to the system. Only accessible by admin or manager roles.',
  })
  @Post('regions')
  public async addRegions(
    @Body() regions: ListRegionsDto,
  ): Promise<RegionResDto[]> {
    const result = await this.managerService.addRegions(regions);
    return result.map((region) => RegionMapper.toResponseDTO(region));
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Remove a producer',
    description:
      'Deletes a producer from the system by their unique identifier (ID). Only accessible by admin or manager roles.',
  })
  @Delete('producers/:id')
  public async removeProducerById(@Param('id') id: ProducerID): Promise<void> {
    return await this.managerService.removeProducerById(id);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Remove a model',
    description:
      'Deletes a model from the system by their unique identifier (ID). Only accessible by admin or manager roles.',
  })
  @Delete('models/:id')
  public async removeModelById(@Param('id') id: ModelID): Promise<void> {
    return await this.managerService.removeModelById(id);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Remove a region',
    description:
      'Deletes a region from the system by their unique identifier (ID). Only accessible by admin or manager roles.',
  })
  @Delete('regions/:id')
  public async removeRegionById(@Param('id') id: RegionID): Promise<void> {
    return await this.managerService.removeRegionById(id);
  }
}
