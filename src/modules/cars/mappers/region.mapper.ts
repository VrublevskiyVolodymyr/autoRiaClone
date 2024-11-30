import { RegionEntity } from '../../../database/entities/region.entity';
import { RegionResDto } from '../../manager/dto/res/region.res.dto';

export class RegionMapper {
  public static toResponseDTO(data: RegionEntity): RegionResDto {
    return {
      id: data.id,
      region: data.region,
    };
  }
}
