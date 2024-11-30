import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdvertisementID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdvertisementQueryDto } from './dto/req/advertisement-query.dto';
import { AdvertisementQueryAdminDto } from './dto/req/advertisement-query-admin.dto';
import { CreateAdvertisementByCarIdDto } from './dto/req/create-advertisement-by-car-id.dto';
import { CreateAdvertisementWithCarDto } from './dto/req/create-advertisement-with-car.dto';
import { CreateAdvertisementWithCarPhotoDto } from './dto/req/create-advertisement-with-car-photo.dto';
import { UpdateAdvertisementDto } from './dto/req/update-advertisement.dto';
import { PublicAdvertisementResDto } from './dto/res/public-advertisement.res.dto';
import { AdvertisementMapper } from './mappers/advertisement.mapper';
import { AdvertisementService } from './services/advertisement.service';

@ApiTags('Advertisement')
@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Create an advertisement by car ID',
    description:
      'Creates an advertisement for a car using the provided car ID and advertisement data. This is used when the car already exists in the system and the advertisement needs to be linked to it.',
  })
  @Post('by_car_id')
  public async createAdvByCarId(
    @Body() advData: CreateAdvertisementByCarIdDto,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicAdvertisementResDto> {
    const result = await this.advertisementService.createAdvByCarId(
      advData,
      userData,
    );
    return AdvertisementMapper.toPublicResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Create an advertisement with a new car',
    description:
      'Creates an advertisement for a new car, including all car details along with the advertisement. This method is used when a new car needs to be registered and advertised.',
  })
  @Post('with_car')
  public async createAdvWithCar(
    @Body() advData: CreateAdvertisementWithCarDto,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicAdvertisementResDto> {
    const result = await this.advertisementService.createAdvWithCar(
      advData,
      userData,
    );
    return AdvertisementMapper.toPublicResponseDto(result);
  }

  @ApiBearerAuth()
  @ApiBody({
    description: 'Advertisement details including car information and photos',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Advertisement title' },
        description: {
          type: 'string',
          description: 'Advertisement description',
        },
        price: { type: 'number', description: 'Price of the car' },
        currency: {
          type: 'string',
          enum: ['USD', 'EUR', 'UAH'],
          description: 'Currency of the price',
        },
        region: { type: 'string', description: 'Region of the advertisement' },
        'car[producer]': { type: 'string', description: 'Car producer' },
        'car[model]': { type: 'string', description: 'Car model' },
        'car[power]': { type: 'number', description: 'Car power' },
        'car[year]': { type: 'number', description: 'Car year of manufacture' },
        'car[color]': { type: 'string', description: 'Car color' },
        'car[mileage]': { type: 'number', description: 'Car mileage' },
        'car[numberDoors]': {
          type: 'number',
          description: 'Number of doors in the car',
        },
        'car[numberSeats]': {
          type: 'number',
          description: 'Number of seats in the car',
        },
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of car photos',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('photos', 10))
  @Roles('admin', 'manager', 'seller')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create an advertisement with car and photos',
    description:
      'Creates an advertisement for a car that includes the car details and multiple photos. The photos are uploaded as part of the advertisement creation process.',
  })
  @Post('with_car_photos')
  public async createAdvWithCarPhoto(
    @Body() advData: CreateAdvertisementWithCarPhotoDto,
    @CurrentUser() userData: IUserData,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<PublicAdvertisementResDto> {
    const result = await this.advertisementService.createAdvWithCarPhoto(
      advData,
      userData,
      photos,
    );
    return AdvertisementMapper.toPublicResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit advertisement by ID',
    description:
      'Edits an existing advertisement by its ID. The user can update the advertisement details as needed.',
  })
  @Patch(':id')
  async editAdvertisement(
    @Param('id', ParseUUIDPipe) id: AdvertisementID,
    @Body() advertisementData: UpdateAdvertisementDto,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicAdvertisementResDto> {
    const result = await this.advertisementService.editAdvertisement(
      id,
      advertisementData,
      userData,
    );
    return AdvertisementMapper.toPublicResponseDto(result);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get available advertisements by parameters',
    description:
      'Retrieves all available advertisements based on query parameters such as car type, price range, and location. No authentication is required.',
  })
  @Get()
  public async getAvailableAdvertisementByParams(
    @Query() query: AdvertisementQueryDto,
  ): Promise<PublicAdvertisementResDto[]> {
    const result =
      await this.advertisementService.getAvailableAdvertisementByParams(query);
    return result.map((adv) => AdvertisementMapper.toPublicResponseDto(adv));
  }

  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Get advertisements by parameters for admins',
    description:
      'Fetches advertisements for administrative users with the ability to filter by various parameters. Only accessible by users with admin or manager roles.',
  })
  @Get('admin')
  public async getAdvertisementByParams(
    @Query() query: AdvertisementQueryAdminDto,
  ): Promise<PublicAdvertisementResDto[]> {
    const result =
      await this.advertisementService.getAdvertisementByParams(query);
    return result.map((adv) => AdvertisementMapper.toPrivateResponseDto(adv));
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller', 'buyer')
  @ApiOperation({
    summary: 'Get available advertisement by ID',
    description:
      'Fetches the details of a specific advertisement by its ID. Available to users with any role, but requires authentication.',
  })
  @Get('/:id')
  public async getAvailableAdvertisementById(
    @Param('id', ParseUUIDPipe) id: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicAdvertisementResDto> {
    const result =
      await this.advertisementService.getAvailableAdvertisementById(
        id,
        userData,
      );
    return AdvertisementMapper.toPublicResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Get advertisement for admins by ID',
    description:
      'Fetches the details of a specific advertisement for administrative users by its ID. Admins and managers have access to all advertisements.',
  })
  @Get('/admin/:id')
  public async getAdvertisementById(
    @Param('id', ParseUUIDPipe) id: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicAdvertisementResDto> {
    const result = await this.advertisementService.getAdvertisementById(
      id,
      userData,
    );
    return AdvertisementMapper.toPrivateResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Delete advertisement by ID',
    description:
      'Deletes a specific advertisement by its ID. Only users with admin, manager, or seller roles can delete advertisements.',
  })
  @Delete(':id')
  async deleteAdvertisementById(
    @Param('id', ParseUUIDPipe) id: AdvertisementID,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.advertisementService.deleteAdvertisementById(
      id,
      userData,
    );
  }
}
