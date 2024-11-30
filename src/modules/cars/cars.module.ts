import { forwardRef, Module } from '@nestjs/common';

import { FileStorageModule } from '../../file-storage/file-storage.module';
import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { CarsController } from './cars.controller';
import { CarsService } from './services/cars.service';
import { SeederService } from './services/seeder.service';

@Module({
  imports: [FileStorageModule, forwardRef(() => AuthModule), RepositoryModule],
  controllers: [CarsController],
  providers: [CarsService, SeederService],
  exports: [CarsService],
})
export class CarsModule {}
