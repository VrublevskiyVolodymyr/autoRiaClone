import { EmailTypeEnum } from '../enums/email-type.enum';

export const emailConstant = {
  [EmailTypeEnum.WELCOME]: {
    subject: 'Welcome',
    template: 'welcome',
  },

  [EmailTypeEnum.FORGOT_PASSWORD]: {
    subject: 'Forgot password',
    template: 'forgot-password',
  },

  [EmailTypeEnum.OLD_VISIT]: {
    subject: 'Old visit',
    template: 'old-visit',
  },

  [EmailTypeEnum.LOGOUT]: {
    subject: 'Logout',
    template: 'logout',
  },

  [EmailTypeEnum.NOTIFY_MISSING_PRODUCER]: {
    subject: 'Producer missing',
    template: 'missing-item',
  },

  [EmailTypeEnum.NOTIFY_MISSING_MODEL]: {
    subject: 'Model missing',
    template: 'missing-item',
  },

  [EmailTypeEnum.REPORT_PRODUCER_RECEIVED]: {
    subject: 'Producer missing',
    template: 'report-received',
  },

  [EmailTypeEnum.REPORT_MODEL_RECEIVED]: {
    subject: 'Model missing',
    template: 'report-received',
  },

  [EmailTypeEnum.NOTIFY_BANNED_ADVERTISEMENT]: {
    subject: 'Banned advertisement',
    template: 'banned-advertisement',
  },
};
