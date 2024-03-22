import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');
  const HOST = configService.get('HOST');
  const PORT = configService.get('PORT');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT, HOST, () => {
    if (NODE_ENV !== 'production') {
      console.log('server is running in development mode');
      console.log('PORT: ', PORT);
      console.log('PID: ', process.pid);
    }
  });
}

bootstrap();
