import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { FinancialController } from './financial.controller';
import { CurrencyService } from './services/currency.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    RepositoryModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [FinancialController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class FinancialModule {}
