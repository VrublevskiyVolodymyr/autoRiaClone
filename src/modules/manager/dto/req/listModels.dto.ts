import { Transform, Type } from 'class-transformer';
import { IsArray, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class ListModelsDto {
  @Transform(TransformHelper.trim)
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  producer: string;

  @Transform(TransformHelper.trimArray)
  @IsArray()
  @IsString({ each: true })
  @Length(2, 50, { each: true })
  @Type(() => String)
  models: string[];
}
