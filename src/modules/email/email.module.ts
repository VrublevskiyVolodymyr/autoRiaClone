import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';

import { Config, EmailConfig } from '../../config/config.types';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        const emailConfig = configService.get<EmailConfig>('email');
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: emailConfig.email,
              pass: emailConfig.password,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          template: {
            dir: path.join(
              process.cwd(),
              'src',
              'modules',
              'email',
              'templates',
              'views',
            ),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
              layoutsDir: path.join(
                process.cwd(),
                'src',
                'modules',
                'email',
                'templates',
                'layouts',
              ),
              partialsDir: path.join(
                process.cwd(),
                'src',
                'modules',
                'email',
                'templates',
                'partials',
              ),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
