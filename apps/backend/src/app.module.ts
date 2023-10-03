import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ChannelsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      serveRoot: '/avatars/',
    }),
  ],
})
export class AppModule {}
