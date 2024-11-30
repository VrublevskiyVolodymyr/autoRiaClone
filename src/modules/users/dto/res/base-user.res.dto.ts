import { PublicAdvertisementResDto } from '../../../advertisement/dto/res/public-advertisement.res.dto';
import { PrivateCarResDto } from '../../../cars/dto/res/private-car.res.dto';
import { AccountTypeEnum } from '../../enums/account-type.enum';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class BaseUserResDto {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  image?: string;

  dealership_id?: string;

  roles?: UserRoleEnum[];

  cars?: PrivateCarResDto[];

  advertisements?: PublicAdvertisementResDto;

  accountType?: AccountTypeEnum;

  is_active?: boolean;

  is_verified?: boolean;

  created?: Date;

  updated?: Date;
}
