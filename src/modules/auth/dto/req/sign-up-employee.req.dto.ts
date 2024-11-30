import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { UserRoleEnum } from '../../../users/enums/user-role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpEmployeeReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'firstName',
  'lastName',
  'deviceId',
]) {
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiHideProperty()
  roles?: UserRoleEnum[];

  @ApiHideProperty()
  public isVerified?: boolean;

  @ApiHideProperty()
  public isActive?: boolean;
}
