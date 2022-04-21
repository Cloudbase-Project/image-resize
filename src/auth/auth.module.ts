import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Password } from './utils/password';
import { JWT } from './utils/token';
import { AuthGuard } from './guards/authGuard';
import { GoogleOAuth } from './utils/GoogleOAuth';
import { MongooseModule } from '@nestjs/mongoose';
import { configModule } from 'src/config/config.module';
import { Config, ConfigSchema } from 'src/config/entities/config.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    ConfigModule,
    forwardRef(() => configModule),
  ],
  controllers: [],
  providers: [Password, AuthGuard, GoogleOAuth, JWT],
  exports: [JWT, AuthGuard],
})
export class authModule {}
