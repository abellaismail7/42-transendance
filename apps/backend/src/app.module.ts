import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ChannelsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      serveRoot: '/avatars/',
    }),
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '/Users/fael-bou/Desktop/42-transendance/apps/backend/.env',
    }),
  ],
})
export class AppModule {}
