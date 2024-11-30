import { Transform, Type } from 'class-transformer';
import { IsArray, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class ListProducersDto {
  @Transform(TransformHelper.trimArray)
  @IsArray()
  @IsString({ each: true })
  @Length(3, 50, { each: true })
  @Type(() => String)
  producers: string[];
}