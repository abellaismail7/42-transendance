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
  UseInterceptors,
  UsePipes,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';

import {
  CreateChannelDto,
  CreateChannelScheme,
} from './dto/create-channel.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './avatars/',
      }),
    }),
  )
  async createChannel(
    @Body(new ZodValidationPipe(CreateChannelScheme))
    createChannelDto: CreateChannelDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.channelsService.createChannel({
      ...createChannelDto,
      image: `http://localhost:4000/${file.path}`,
    });
  }

  @Get('messages')
  async findMessages(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('channelId', ParseUUIDPipe) channelId: string,
  ) {
    return await this.channelsService.findMessages(userId, channelId);
  }

  @Get('/members/:channelId')
  async findMembers(@Param('channelId', ParseUUIDPipe) channelId: string) {
    return this.channelsService.findMembers(channelId);
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
