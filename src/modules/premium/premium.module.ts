import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { PremiumController } from './premium.controller';
import { LiqPayService } from './services/lig-pay.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    RepositoryModule,
    ConfigModule,
    HttpModule,
  ],
  controllers: [PremiumController],
  providers: [LiqPayService],
  exports: [LiqPayService],
})
export class PremiumModule {}
