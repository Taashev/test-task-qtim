import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { corsConfig } from './configs/cors.config';
import { TypeOrmExceptionFilter } from './exception-filters/typeorm.exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig);

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');
  const HOST = configService.get('HOST');
  const PORT = configService.get('PORT');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

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
