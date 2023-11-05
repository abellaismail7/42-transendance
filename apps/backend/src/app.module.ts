import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ChannelsModule, AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      serveRoot: '/avatars/',
    }),
    GameModule,
  ],
})
export class AppModule {}
