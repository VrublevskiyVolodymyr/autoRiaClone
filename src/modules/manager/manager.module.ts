import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { RepositoryModule } from '../repository/repository.module';
import { ManagerController } from './manager.controller';
import { ManagerService } from './services/manager.service';

@Module({
  imports: [forwardRef(() => AuthModule), RepositoryModule, EmailModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
