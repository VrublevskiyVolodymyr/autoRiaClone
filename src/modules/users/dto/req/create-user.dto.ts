import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class CreateUserDto {
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  public readonly firstName: string;

  @Transform(TransformHelper.trim)
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  public readonly lastName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  public readonly password: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  public image?: string;

  @Transform(TransformHelper.trim)
  @IsString()
  @IsOptional()
  public readonly phone?: string;

  public role?: UserRoleEnum;

  public is_verified?: boolean;

  public is_active?: boolean;
}
