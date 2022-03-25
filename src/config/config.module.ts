import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/config/entities/config.entity';
import { configService } from './config.service';
import { configController } from './config.controller';
import Utils from './utils/utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [configController],
  providers: [configService, Utils, Config],
  exports: [Config],
})
export class configModule {}
