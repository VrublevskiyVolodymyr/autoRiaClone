import { PremiumPurchaseEntity } from '../../../database/entities/premium-purchase.entity';
import { PremiumDto } from '../dto/premium.dto';

export class PremiumMapper {
  public static toCurrencyDto(data: PremiumPurchaseEntity): PremiumDto {
    return {
      id: data.id,
      orderId: data.orderId,
      userId: data.user.id,
    };
  }
}
