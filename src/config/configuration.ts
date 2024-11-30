import * as process from 'node:process';

import { Config } from './config.types';

export default (): Config => ({
  app: {
    port: Number(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || 'localhost',
  },
  postgres: {
    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  action: {
    actionForgotPasswordSecret: process.env.ACTION_FORGOT_PASSWORD_SECRET,
    actionForgotPasswordExpiration: Number(
      process.env.ACTION_FORGOT_PASSWORD_EXPIRATION,
    ),
    actionVerifyEmailSecret: process.env.ACTION_VERIFY_EMAIL_SECRET,
    actionVerifyEmailExpiration: Number(
      process.env.ACTION_VERIFY_EMAIL_EXPIRATION,
    ),
  },
  aws: {
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    bucketUrl: process.env.AWS_S3_BUCKET_URL,
    endpoint: process.env.AWS_S3_ENDPOINT,
  },

  email: {
    email: process.env.SMTP_EMAIL,
    frontendUrl: process.env.FRONTEND_URL,
    password: process.env.SMTP_PASSWORD,
  },
  manager: {
    managerEmail: process.env.MANAGER_EMAIL,
    frontUrl: process.env.FRONTEND_URL,
  },
  privatbank: {
    privatbankApiUrl: process.env.PRIVATBANK_API_URL,
  },
  liqpay: {
    liqPayPublicKey: process.env.LIQPAY_PUBLIC_KEY,
    liqPayPrivateKey: process.env.LIQPAY_PRIVATE_KEY,
    liqPayApiResUrl: process.env.LIQPAYAPIRESURL,
    liqPayApiReqUrl: process.env.LIQPAYAPIREQURL,
  },
});
