import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configSettings } from './configs/config-settings';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(configSettings)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
