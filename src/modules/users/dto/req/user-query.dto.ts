import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class UserQueryDto {
  @Transform(TransformHelper.trim)
  @IsString()
  @IsOptional()
  @Length(3, 50)
  @Type(() => String)
  public readonly firstName?: string;

  @Transform(TransformHelper.trim)
  @IsString()
  @Length(3, 50)
  @IsOptional()
  @Type(() => String)
  public readonly lastName?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @IsOptional()
  @Length(0, 300)
  email?: string;

  @Transform(TransformHelper.trim)
  @IsString()
  @IsOptional()
  public readonly phone?: string;

  @IsEnum(UserRoleEnum, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  public roles?: UserRoleEnum[];

  @IsBoolean()
  @IsOptional()
  public is_verified?: boolean;

  @IsBoolean()
  @IsOptional()
  public is_active?: boolean;
}
