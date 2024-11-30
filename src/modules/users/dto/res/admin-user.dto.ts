import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class AdminUserResDto extends PickType(BaseUserResDto, [
  'id',
  'firstName',
  'lastName',
  'email',
  'image',
  'phone',
  'is_active',
  'is_verified',
  'accountType',
]) {}
