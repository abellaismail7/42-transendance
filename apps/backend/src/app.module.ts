import { ChannelsModule } from './channels/channels.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ChannelsModule, UsersModule, AuthModule],
})
export class AppModule {}
