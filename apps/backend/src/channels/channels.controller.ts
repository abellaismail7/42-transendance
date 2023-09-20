import { FindMessagesDto, FindMessagesScheme } from './dto/find-messages.dto';
import { JoinChannelDto, JoinChannelScheme } from './dto/join-channel.dto';
import { ZodValidationPipe } from 'src/zod/zod.validator';
import { ChannelsService } from './channels.service';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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

  @Post('join')
  @UsePipes(new ZodValidationPipe(JoinChannelScheme))
  async joinChannel(@Body() joinChannelDto: JoinChannelDto) {
    return this.channelsService.joinChannel(joinChannelDto);
  }

  @Get('messages')
  @UsePipes(new ZodValidationPipe(FindMessagesScheme))
  async findMessages(@Body() findMessagesDto: FindMessagesDto) {
    return await this.channelsService.findMessages(findMessagesDto);
  }

  @Get('user/:userId')
  async findChannelsFor(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.channelsService.findChannelsFor(userId);
  }
}
