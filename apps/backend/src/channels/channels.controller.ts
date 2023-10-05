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
  createChannel(
    @Body(new ZodValidationPipe(CreateChannelScheme))
    createChannelDto: CreateChannelDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File | null,
  ) {
    return this.channelsService.createChannel({
      ...createChannelDto,
      image: file
        ? `http://localhost:4000/${file.path}`
        : 'https://placehold.co/400', // TODO(saidooubella): Need to be changed with a more bette alternative
    });
  }

  @Get('messages')
  findMessages(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('channelId', ParseUUIDPipe) channelId: string,
  ) {
    return this.channelsService.findMessages(userId, channelId);
  }

  @Get('/members/:channelId')
  findMembers(@Param('channelId', ParseUUIDPipe) channelId: string) {
    return this.channelsService.findMembers(channelId);
  }

  @Post('messages')
  @UsePipes(new ZodValidationPipe(SendMessageScheme))
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.channelsService.sendMessage(sendMessageDto);
  }

  @Post('join')
  @UsePipes(new ZodValidationPipe(JoinChannelScheme))
  joinChannel(@Body() joinChannelDto: JoinChannelDto) {
    return this.channelsService.joinChannel(joinChannelDto);
  }

  @Get('user/:userId')
  findChannelsFor(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.channelsService.findChannelsFor(userId);
  }

  @Get('search')
  searchChannels(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('q') query: string,
  ) {
    return this.channelsService.searchChannels(userId, query);
  }
}
