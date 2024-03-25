import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';

// валидация переменных окружения и преобразование к нужному типу
const validationSchema = Joi.object({
  HOST: Joi.string().default('localhost'), // хост приложения
  PORT: Joi.number().default(3000), // порт приложения
  NODE_ENV: Joi.string().default('dev'), // режим работы

  JWT_SECRET: Joi.string().required(), // секретный ключ для подписания jwt
  JWT_EXPIRES_IN: Joi.string().required(), // время жизни jwt токена

  HASH_PASSWORD_SALT: Joi.number().default(10), // соль для хеширования пароля

  CACHE_TTL_POST: Joi.number().default(5000), // по умолчанию время жизни кеша 5 секунд
  CACHE_MAX_POST: Joi.number().default(500), // по умолчанию кеше может храниться 500 статей

  PG_HOST: Joi.string().default('localhost'), // хост для подключения БД
  PG_PORT: Joi.number().default(5432), // порт для подлкючения к БД
  PG_NAME: Joi.string().required(), // имя БД
  PG_USER: Joi.string().required(), // имя пользователя БД
  PG_PASSWORD: Joi.string().required(), // пароль пользователя БД
  PG_SYNCHRONIZE: Joi.boolean().default(false), // синхронизация БД с кодом отключена
  PG_CACHE: Joi.boolean().default(false), // кеш БД отключен

  REDIS_HOST: Joi.string().default('localhost'), // хост для подключения к redis
  REDIS_POST: Joi.number().default(6379), // порт для подлкюченя к redis
});

const envFilePath = ['.env']; // имя файла переменных окружения

// конфиг для модуля работы с переменными окружения
export const appConfig: ConfigModuleOptions = {
  isGlobal: false, // модуль не является глобальным
  ignoreEnvFile: false, // модуль не игнорирует файл .env и берет переменные из файла
  envFilePath,
  validationSchema,
};
