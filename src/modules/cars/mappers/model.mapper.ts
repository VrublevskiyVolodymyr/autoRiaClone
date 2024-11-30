import { ModelEntity } from '../../../database/entities/model.entity';
import { ModelResDto } from '../../manager/dto/res/model.res.dto';

export class ModelMapper {
  public static toResponseDTO(data: ModelEntity): ModelResDto {
    return {
      id: data.id,
      model: data.model,
    };
  }
}
