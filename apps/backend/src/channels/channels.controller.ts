import { JoinChannelDto, JoinChannelScheme } from './dto/join-channel.dto';
import { SendMessageDto, SendMessageScheme } from './dto/send-message.dto';
import { ZodValidationPipe } from 'src/zod/zod.validator';
import { ChannelsService } from './channels.service';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';

import {
  CreateChannelDto,
  CreateChannelScheme,
} from './dto/create-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateChannelScheme))
  async createChannel(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelsService.createChannel(createChannelDto);
  }

  @Get('messages')
  async findMessages(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('channelId', ParseUUIDPipe) channelId: string,
  ) {
    return await this.channelsService.findMessages(userId, channelId);
  }

  @Post('messages')
  @UsePipes(new ZodValidationPipe(SendMessageScheme))
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return await this.channelsService.sendMessage(sendMessageDto);
  }

  @Post('join')
  @UsePipes(new ZodValidationPipe(JoinChannelScheme))
  async joinChannel(@Body() joinChannelDto: JoinChannelDto) {
    return await this.channelsService.joinChannel(joinChannelDto);
  }

  @Get('user/:userId')
  findChannelsFor(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.channelsService.findChannelsFor(userId);
  }
}
