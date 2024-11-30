import { EmailTypeEnum } from '../enums/email-type.enum';
import { EmailPayloadCombinedType } from './email-payload-combined.type';
import { PickRequired } from './pick-required.type';

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'actionToken' | 'frontUrl'
  >;

  [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombinedType,
    'frontUrl' | 'email' | 'actionToken'
  >;

  [EmailTypeEnum.OLD_VISIT]: PickRequired<EmailPayloadCombinedType, 'name'>;

  [EmailTypeEnum.LOGOUT]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'frontUrl'
  >;

  [EmailTypeEnum.NOTIFY_MISSING_PRODUCER]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'item'
  >;

  [EmailTypeEnum.NOTIFY_MISSING_MODEL]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'item'
  >;

  [EmailTypeEnum.REPORT_PRODUCER_RECEIVED]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'item' | 'frontUrl'
  >;

  [EmailTypeEnum.REPORT_MODEL_RECEIVED]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'item' | 'frontUrl'
  >;

  [EmailTypeEnum.NOTIFY_BANNED_ADVERTISEMENT]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'advertisement'
  >;
};
