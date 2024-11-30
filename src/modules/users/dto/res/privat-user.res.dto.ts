import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class PrivateUserResDto extends PickType(BaseUserResDto, [
  'id',
  'firstName',
  'lastName',
  'email',
  'image',
  'phone',
]) {}
