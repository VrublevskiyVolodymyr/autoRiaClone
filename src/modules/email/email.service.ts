import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { Config, EmailConfig } from '../../config/config.types';
import { emailConstant } from './constants/email.constants';
import { EmailTypeEnum } from './enums/email-type.enum';
import { EmailTypeToPayloadType } from './types/email-type-to-payload';

@Injectable()
export class EmailService {
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly mailerService: MailerService,
  ) {
    this.emailConfig = this.configService.get<EmailConfig>('email');
  }

  async sendEmail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayloadType[T],
  ): Promise<void> {
    const { subject, template } = emailConstant[type];

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
