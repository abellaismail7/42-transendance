import { CreateChannelDto } from './dto/create-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';

import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO(saidooubella): marked for removal after using it for testing
  delay(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  async searchChannels(userId: string, query: string) {
    return await this.prisma.channel.findMany({
      where: {
        access: { in: ['PUBLIC', 'PROTECTED'] },
        name: { contains: query },
        members: { none: { userId } },
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        access: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });
  }

  findMembers(channelId: string) {
    return this.prisma.channelMember.findMany({
      where: { channelId, joinStatus: 'JOINED', isBanned: false },
      select: {
        isAdmin: true,
        isMuted: true,
        muteDuration: true,
        user: {
          select: {
            id: true,
            username: true,
            login: true,
            state: true,
            image: true,
          },
        },
      },
    });
  }

  async createChannel(props: CreateChannelDto & { image: string }) {
    await this.asssertUserExists(props.ownerId);

    return await this.prisma.channel.create({
      data: {
        ...props,
        password:
          props.password !== undefined ? await hash(props.password, 10) : null,
        members: {
          create: {
            userId: props.ownerId,
            isAdmin: true,
            joinStatus: 'JOINED',
          },
        },
      },
    });
  }

  async joinChannel({ channelId, userId, password }: JoinChannelDto) {
    await this.asssertUserExists(userId);

    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
    });

    if (channel === null) {
      throw new NotFoundException("The channel doesn't exists");
    }

    if (channel.access === 'PROTECTED' && password === undefined) {
      throw new BadRequestException('Protected channels requires a password');
    }

    if (channel.access !== 'PROTECTED' && password !== undefined) {
      throw new BadRequestException(
        'Non protected channels do not require a password',
      );
    }

    switch (channel.access) {
      case 'PRIVATE':
        await this.prisma.channelMember.create({
          data: {
            channelId,
            userId,
            isAdmin: false,
            joinStatus: 'WAIT_FOR_APPROVAL',
          },
        });
        break;
      case 'PROTECTED':
        if (!(await compare(password!, channel.password!))) {
          throw new ForbiddenException('Invalid channel password');
        }
      case 'PUBLIC':
        await this.prisma.channelMember.create({
          data: {
            channelId,
            userId,
            isAdmin: false,
            joinStatus: 'JOINED',
          },
        });
        break;
    }
  }

  async findChannelsFor(userId: string) {
    await this.asssertUserExists(userId);
    const channels = await this.prisma.channel.findMany({
      where: { members: { some: { userId } } },
    });
    const res = await Promise.all(
      channels.map(async (channel) => {
        const lastMessage = await this.prisma.channelMessage.findFirst({
          where: { channelId: channel.id },
          orderBy: { createdAt: 'desc' },
        });

        const member = await this.prisma.channelMember.findFirst({
          where: { channelId: channel.id, userId },
        });

        const lastMessageContent =
          member?.joinStatus === 'JOINED'
            ? lastMessage?.content ?? 'There are no messages'
            : null;

        return {
          id: channel.id,
          name: channel.name,
          image: channel.image,
          lastMessage: lastMessageContent,
          joinStatus: member!.joinStatus,
        };
      }),
    );
    return res;
  }

  async findMessages(userId: string, channelId: string) {
    await this.asssertUserExists(userId);
    await this.asssertChannelExists(channelId);
    await this.assertIsMember(channelId, userId);
    return await this.prisma.channelMessage.findMany({
      where: { channelId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            login: true,
            image: true,
          },
        },
      },
    });
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    await this.asssertUserExists(sendMessageDto.senderId);
    await this.asssertChannelExists(sendMessageDto.channelId);
    await this.assertIsMember(
      sendMessageDto.channelId,
      sendMessageDto.senderId,
    );
    return this.prisma.channelMessage.create({
      data: { ...sendMessageDto },
    });
  }

  private async assertIsMember(channelId: string, userId: string) {
    const userCount = await this.prisma.channel.count({
      where: { id: channelId, members: { some: { userId } } },
    });

    if (userCount < 1) {
      throw new ForbiddenException(
        "The user don't belongs to the requested channel",
      );
    }
  }

  private async asssertUserExists(userId: string) {
    const userExists = await this.prisma.user.count({ where: { id: userId } });
    if (userExists < 1) throw new NotFoundException("The user doesn't exists");
  }

  private async asssertChannelExists(channelId: string) {
    const userExists = await this.prisma.channel.count({
      where: { id: channelId },
    });

    if (userExists < 1) {
      throw new NotFoundException("The channel doesn't exists");
    }
  }
}
