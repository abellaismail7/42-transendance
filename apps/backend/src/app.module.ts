import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ChannelsModule, AuthModule]
})
export class AppModule {}
