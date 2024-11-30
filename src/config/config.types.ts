export type Config = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  jwt: JwtConfig;
  action: ActionConfig;
  aws: AwsConfig;
  email: EmailConfig;
  manager: ManagerConfig;
  privatbank: PrivatBankConfig;
  liqpay: LiqPayConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type PostgresConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
};


export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type ActionConfig = {
  actionForgotPasswordSecret: string;
  actionForgotPasswordExpiration: number;
  actionVerifyEmailSecret: string;
  actionVerifyEmailExpiration: number;
};

export type AwsConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketUrl: string;
  endpoint: string;
};

export type EmailConfig = {
  email: string;
  frontendUrl: string;
  password: string;
};

export type ManagerConfig = {
  managerEmail: string;
  frontUrl: string;
};

export type PrivatBankConfig = {
  privatbankApiUrl: string;
};

export type LiqPayConfig = {
  liqPayPublicKey: string;
  liqPayPrivateKey: string;
  liqPayApiResUrl: string;
  liqPayApiReqUrl: string;
};
