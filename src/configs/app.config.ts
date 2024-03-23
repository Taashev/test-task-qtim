import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';

const validationSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().default('dev'),

  PG_HOST: Joi.string().default('localhost'),
  PG_PORT: Joi.number().default(5432),
  PG_NAME: Joi.string().required(),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_SYNCHRONIZE: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().required(),
});

const envFilePath = ['.env'];

export const appConfig: ConfigModuleOptions = {
  isGlobal: false,
  ignoreEnvFile: false,
  envFilePath,
  validationSchema,
};
