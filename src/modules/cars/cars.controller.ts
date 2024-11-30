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

import { ApiFile } from '../../common/decorators/api-file-decorator';
import {
  CarID,
  ModelID,
  ProducerID,
  RegionID,
} from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { ModelResDto } from '../manager/dto/res/model.res.dto';
import { ProducerResDto } from '../manager/dto/res/producer.res.dto';
import { RegionResDto } from '../manager/dto/res/region.res.dto';
import { CarQueryDto } from './dto/req/car-query.dto';
import { CreateCarDto } from './dto/req/create-car.dto';
import { CreateCarWithPhotoDto } from './dto/req/create-car-with-photo.dto';
import { UpdateCarDto } from './dto/req/update-car.dto';
import { PrivateCarResDto } from './dto/res/private-car.res.dto';
import { PublicCarResDto } from './dto/res/public-car.res.dto';
import { CarMapper } from './mappers/car.mapper';
import { ModelMapper } from './mappers/model.mapper';
import { ProducerMapper } from './mappers/producer.mapper';
import { RegionMapper } from './mappers/region.mapper';
import { CarsService } from './services/cars.service';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Create a car',
    description: 'Creates a new car based on the provided data.',
  })
  @Post()
  public async createCar(
    @Body() carData: CreateCarDto,
    @CurrentUser() userData: IUserData,
  ): Promise<PublicCarResDto> {
    const result = await this.carsService.createCar(carData, userData);
    return CarMapper.toPublicResponseDto(result);
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateCarWithPhotoDto })
  @UseInterceptors(FilesInterceptor('photos', 10))
  @Roles('admin', 'manager', 'seller')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a car with photos',
    description:
      'Creates a car and uploads multiple photos for it. Supports up to 10 photos.',
  })
  @Post('with_photos')
  public async createCarWithPhoto(
    @Body() carData: CreateCarDto,
    @CurrentUser() userData: IUserData,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<PrivateCarResDto> {
    const result = await this.carsService.createCarWithPhoto(
      carData,
      userData,
      photos,
    );
    return CarMapper.toPrivateResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get cars by parameters',
    description:
      'Fetches a list of cars based on the provided query parameters.',
  })
  @Get()
  public async getCarsByParams(
    @Query() query: CarQueryDto,
  ): Promise<PrivateCarResDto[]> {
    const result = await this.carsService.getCarsByParams(query);
    return result.map((car) => CarMapper.toPrivateResponseDto(car));
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @UseInterceptors(FilesInterceptor('photos', 10))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiFile('photos', true, false)
  @ApiOperation({
    summary: 'Upload photos for a car',
    description: 'Uploads up to 10 photos for an existing car.',
  })
  @Post('photos/:carId')
  public async uploadPhotos(
    @Param('carId', ParseUUIDPipe) carId: CarID,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<void> {
    await this.carsService.uploadPhotos(carId, photos);
  }

  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Delete a car photo',
    description: 'Deletes a specific photo of a car based on the provided URL.',
  })
  @Delete(':carId/photo')
  async deletePhoto(
    @Param('carId', ParseUUIDPipe) carId: CarID,
    @Query('fullUrl') fullUrl: string,
  ): Promise<void> {
    await this.carsService.deletePhoto(carId, fullUrl);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get all producers',
    description:
      'Fetches a list of all car producers available in the database.',
  })
  @Get('producers')
  public async getProducers(): Promise<ProducerResDto[]> {
    const result = await this.carsService.getProducers();
    return result.map((producer) => ProducerMapper.toResponseDTO(producer));
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get all models',
    description: 'Fetches a list of all car models available in the database.',
  })
  @Get('models')
  public async getModels(): Promise<ModelResDto[]> {
    const result = await this.carsService.getModels();
    return result.map((model) => ModelMapper.toResponseDTO(model));
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get models by producer ID',
    description: 'Fetches a list of car models for a specific producer.',
  })
  @Get('models/producers/:id')
  public async getModelsByProducerId(
    @Param('id', ParseUUIDPipe) id: ProducerID,
  ): Promise<ModelResDto[]> {
    const result = await this.carsService.getModelsByProducerId(id);
    return result.map((model) => ModelMapper.toResponseDTO(model));
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get all regions',
    description: 'Fetches a list of all regions where cars are available.',
  })
  @Get('regions')
  public async getRegions(): Promise<RegionResDto[]> {
    const result = await this.carsService.getRegions();
    return result.map((region) => RegionMapper.toResponseDTO(region));
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get producer by ID',
    description: 'Fetches details of a specific car producer by ID.',
  })
  @Get('producers/:id')
  public async getProducerById(
    @Param('id', ParseUUIDPipe) id: ProducerID,
  ): Promise<ProducerResDto> {
    const result = await this.carsService.getProducerById(id);
    return ProducerMapper.toResponseDTO(result);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get model by ID',
    description: 'Fetches details of a model by its ID.',
  })
  @Get('models/:id')
  public async getModelById(
    @Param('id', ParseUUIDPipe) id: ModelID,
  ): Promise<ModelResDto> {
    const result = await this.carsService.getModelById(id);
    return ModelMapper.toResponseDTO(result);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Get region by ID',
    description: 'Fetches details of a region by its ID.',
  })
  @Get('regions/:id')
  public async getRegionById(
    @Param('id', ParseUUIDPipe) id: RegionID,
  ): Promise<RegionResDto> {
    const result = await this.carsService.getRegionById(id);
    return RegionMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Get car by ID',
    description: 'Fetches details of a specific car by its ID.',
  })
  @Get('/:id')
  public async getCarById(
    @Param('id', ParseUUIDPipe) id: CarID,
  ): Promise<PrivateCarResDto> {
    const result = await this.carsService.getCarById(id);
    return CarMapper.toPrivateResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager', 'seller')
  @ApiOperation({
    summary: 'Update car by ID',
    description: 'Updates details of a specific car by its ID.',
  })
  @Patch('/:id')
  public async updateCarById(
    @Param('id', ParseUUIDPipe) id: CarID,
    @Body() dto: UpdateCarDto,
  ): Promise<PrivateCarResDto> {
    const result = await this.carsService.updateCarById(dto, id);
    return CarMapper.toPrivateResponseDto(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Delete car by ID',
    description: 'Deletes a specific car by its ID.',
  })
  @Delete('/:id')
  public async deleteCarById(
    @Param('id', ParseUUIDPipe) id: CarID,
  ): Promise<void> {
    await this.carsService.deleteCarById(id);
  }
}
