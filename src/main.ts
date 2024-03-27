import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { corsConfig } from './configs/cors.config';
import { TypeOrmExceptionFilter } from './exception-filters/typeorm.exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // включить CORS заголовки
  app.enableCors(corsConfig);

  // сервис переменных окружения
  const configService = app.get(ConfigService);

  // среда выполнения
  const NODE_ENV = configService.get('NODE_ENV');
  // хост приложения
  const HOST = configService.get('HOST');
  // порт приложения
  const PORT = configService.get('PORT');

  // включить глобально преобразование параметров запроса и проверку передаваемых полей
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // перехватчик исключений typeORM
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(PORT, HOST, () => {
    if (NODE_ENV !== 'production') {
      console.log('server is running in development mode');
      console.log('PORT: ', PORT);
      console.log('PID: ', process.pid);
    }
  });
}

bootstrap();
