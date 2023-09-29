import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelsMessagesGateway } from './messages.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsMessagesGateway],
})
export class ChannelsModule {}
