import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from '../common/http/global-exceptiom.filter';
import configuration from '../config/configuration';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { EmailModule } from './email/email.module';
import { FinancialModule } from './financial/financial.module';
import { InfoModule } from './info/info.module';
import { LoggerModule } from './logger/logger.module';
import { ManagerModule } from './manager/manager.module';
import { PostgresModule } from './postgres/postgres.module';
import { PremiumModule } from './premium/premium.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PostgresModule,
    RedisModule,
    AuthModule,
    UsersModule,
    RepositoryModule,
    FileStorageModule,
    LoggerModule,
    EmailModule,
    ManagerModule,
    CarsModule,
    FinancialModule,
    AdvertisementModule,
    PremiumModule,
    InfoModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
