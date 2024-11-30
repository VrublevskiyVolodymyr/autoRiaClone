import { JoinColumn, OneToOne } from 'typeorm';

import { PremiumID, UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';

export class PremiumDto {
  id?: PremiumID;

  orderId: string;

  @OneToOne(() => UserEntity, { cascade: true, eager: true })
  @JoinColumn()
  userId: UserID;
}
