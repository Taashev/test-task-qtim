import * as Joi from 'joi';

const validationSchemaConfig = Joi.object({
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('localhost'),
  NODE_ENV: Joi.string().default('dev'),

  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

const envPath = '.env';

export const configSettings = {
  isGlobal: true,
  envFilePath: envPath,
  validationSchema: validationSchemaConfig,
};
