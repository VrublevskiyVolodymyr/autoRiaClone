import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { InfoController } from './info.controller';
import { InfoService } from './services/info.service';

@Module({
  imports: [forwardRef(() => AuthModule), RepositoryModule],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
