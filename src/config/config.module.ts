import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/config/entities/config.entity';
import { configService } from './config.service';
import { configController } from './config.controller';
import Utils from './utils/utils';
import { authModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    authModule,
  ],
  controllers: [configController],
  exports: [Config],
  providers: [configService, Utils, Config],
})
export class configModule {}
