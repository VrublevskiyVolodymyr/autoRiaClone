import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class UpdateUserDto {
  @IsOptional()
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(2, 20)
  firstName?: string;

  @IsOptional()
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(2, 20)
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
