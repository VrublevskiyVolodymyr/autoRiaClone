import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '../modules/logger/logger.module';
import { FileStorageService } from './services/file-storage.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
