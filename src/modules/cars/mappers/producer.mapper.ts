import { ProducerEntity } from '../../../database/entities/producer.entity';
import { ProducerResDto } from '../../manager/dto/res/producer.res.dto';

export class ProducerMapper {
  public static toResponseDTO(data: ProducerEntity): ProducerResDto {
    return {
      id: data.id,
      producer: data.producer,
    };
  }
}
