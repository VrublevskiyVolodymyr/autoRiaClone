import { forwardRef, Module } from '@nestjs/common';

import { FileStorageModule } from '../../file-storage/file-storage.module';
import { AuthModule } from '../auth/auth.module';
import { CarsModule } from '../cars/cars.module';
import { FinancialModule } from '../financial/financial.module';
import { ManagerModule } from '../manager/manager.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './services/advertisement.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    RepositoryModule,
    ManagerModule,
    FileStorageModule,
    FinancialModule,
    CarsModule,
  ],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {}
