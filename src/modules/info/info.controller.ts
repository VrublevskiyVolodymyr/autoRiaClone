import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  AdvertisementID,
  ModelID,
  ProducerID,
  RegionID,
} from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CurrencyEnum } from '../financial/enums/cerrency.enum';
import { AveragePriceDto } from './dto/average-price.dto';
import { ViewCountForAdvertisementDto } from './dto/view-count-for-advertisement.dto';
import { InfoService } from './services/info.service';

@ApiTags('Info')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get daily views for an advertisement',
    description:
      'Returns the number of views for a specific advertisement for the last 24 hours.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the advertisement.',
  })
  @Get('advertisement/:id/daily-views')
  async getDailyViewCountForAdvertisement(
    @Param('id', ParseUUIDPipe) advertisementId: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    return await this.infoService.getDailyViewCountForAdvertisement(
      advertisementId,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get weekly views for an advertisement',
    description:
      'Returns the number of views for a specific advertisement for the last 7 days.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the advertisement.',
  })
  @Get('advertisement/:id/weekly_views')
  async getWeeklyViewCountForAdvertisement(
    @Param('id', ParseUUIDPipe) advertisementId: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    return await this.infoService.getWeeklyViewCountForAdvertisement(
      advertisementId,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get monthly views for an advertisement',
    description:
      'Returns the number of views for a specific advertisement for the last 30 days.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the advertisement.',
  })
  @Get('advertisement/:id/monthly_views')
  async getMonthlyViewCountForAdvertisement(
    @Param('id', ParseUUIDPipe) advertisementId: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    return await this.infoService.getMonthlyViewCountForAdvertisement(
      advertisementId,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get all-time views for an advertisement',
    description:
      'Returns the total number of views for a specific advertisement.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the advertisement.',
  })
  @Get('advertisement/:id/all_views')
  async getAllViewCountForAdvertisement(
    @Param('id', ParseUUIDPipe) advertisementId: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<ViewCountForAdvertisementDto> {
    return await this.infoService.getAllViewCountForAdvertisement(
      advertisementId,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get average price by region',
    description:
      'Returns the average price of a specific model from a specific producer in a specific region.',
  })
  @ApiQuery({
    name: 'producerId',
    description: 'The ID of the producer.',
    required: true,
  })
  @ApiQuery({
    name: 'regionId',
    description: 'The ID of the region.',
    required: true,
  })
  @ApiQuery({
    name: 'modelId',
    description: 'The ID of the model.',
    required: true,
  })
  @ApiQuery({
    name: 'currency',
    description: 'The currency in which the average price is returned.',
    enum: CurrencyEnum,
    required: true,
  })
  @Get('average-price/region')
  async getAveragePriceByRegion(
    @Query('producerId', ParseUUIDPipe) producerId: ProducerID,
    @Query('regionId', ParseUUIDPipe) regionId: RegionID,
    @Query('modelId', ParseUUIDPipe) modelId: ModelID,
    @Query('currency') currency: CurrencyEnum,
    @CurrentUser() userData: IUserData,
  ): Promise<AveragePriceDto> {
    return await this.infoService.getAveragePriceByRegion(
      producerId,
      regionId,
      modelId,
      currency,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get average price across Ukraine',
    description:
      'Returns the average price of a specific model from a specific producer across Ukraine.',
  })
  @ApiQuery({
    name: 'producerId',
    description: 'The ID of the producer.',
    required: true,
  })
  @ApiQuery({
    name: 'modelId',
    description: 'The ID of the model.',
    required: true,
  })
  @ApiQuery({
    name: 'currency',
    description: 'The currency in which the average price is returned.',
    enum: CurrencyEnum,
    required: true,
  })
  @Get('average-price/ukraine')
  async getAveragePriceForUkraine(
    @Query('producerId', ParseUUIDPipe) producerId: ProducerID,
    @Query('modelId', ParseUUIDPipe) modelId: ModelID,
    @Query('currency') currency: CurrencyEnum,
    @CurrentUser() userData: IUserData,
  ): Promise<AveragePriceDto> {
    return await this.infoService.getAveragePriceForUkraine(
      producerId,
      modelId,
      currency,
      userData,
    );
  }
}
