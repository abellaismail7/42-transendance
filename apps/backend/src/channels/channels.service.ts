import { CreateChannelDto } from './dto/create-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinioService } from 'src/minio/minio.service';
import { hash, compare } from 'bcrypt';

import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  // TODO(saidooubella): marked for removal after using it for testing
  delay(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  async rejectInvitation(invitationId: string) {
    await this.prisma.channelInvitation.delete({
      where: { id: invitationId },
    });
  }

  async acceptInvitation(invitationId: string) {
    const invitation = await this.prisma.channelInvitation.delete({
      where: { id: invitationId },
    });

    await this.asssertChannelExists(invitation.channelId);
    await this.asssertUserExists(invitation.receiverId);

    await this.prisma.channelMember.create({
      data: {
        channelId: invitation.channelId,
        userId: invitation.receiverId,
        isAdmin: false,
      },
    });
  }

  async findInvitations(userId: string) {
    await this.asssertUserExists(userId);

    return this.prisma.channelInvitation.findMany({
      where: { receiverId: userId },
      include: { channel: { select: { name: true, image: true } } },
    });
  }

  async inviteUser(inviteUserDto: InviteUserDto) {
    await this.asssertChannelExists(inviteUserDto.channelId);
    await this.asssertUserExists(inviteUserDto.receiverId);

    const hasUser = await this.prisma.channelMember.count({
      where: {
        channelId: inviteUserDto.channelId,
        userId: inviteUserDto.receiverId,
      },
    });

    if (hasUser > 0) {
      throw new BadRequestException('The user is already a member');
    }

    return this.prisma.channelInvitation.create({
      data: inviteUserDto,
    });
  }

  async findInvitableUsersFor(channelId: string, query: string) {
    await this.asssertChannelExists(channelId);

    return await this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { login: { contains: query, mode: 'insensitive' } },
        ],
        channelsInvitaitons: { none: { channelId } },
        channels: { none: { channelId } },
      },
      select: {
        id: true,
        username: true,
        login: true,
        email: true,
        image: true,
      },
    });
  }

  async searchChannels(userId: string, query: string) {
    await this.asssertUserExists(userId);

    return await this.prisma.channel.findMany({
      where: {
        access: { in: ['PUBLIC', 'PROTECTED'] },
        name: { contains: query, mode: 'insensitive' },
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

  async findMembers(channelId: string) {
    await this.asssertChannelExists(channelId);

    return await this.prisma.channelMember.findMany({
      where: { channelId, isBanned: false },
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

  async createChannel({
    name,
    access,
    ownerId,
    password,
    image,
  }: CreateChannelDto & { image: Buffer | null }) {
    await this.asssertUserExists(ownerId);

    const imageUrl = 'http://localhost:9000/avatars/channel_default.png';

    const channel = await this.prisma.channel.create({
      data: {
        name,
        access,
        ownerId,
        image: imageUrl,
        password: password !== undefined ? await hash(password, 10) : null,
        members: {
          create: {
            userId: ownerId,
            isAdmin: true,
          },
        },
      },
    });

    if (image) {
      const imageName = 'channel_' + channel.id;
      await this.minio.writeAvatar(imageName, image);

      return await this.prisma.channel.update({
        where: { id: channel.id },
        data: { image: 'http://localhost:9000/avatars/' + imageName },
      });
    }

    return channel;
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
        throw new ForbiddenException(
          'Private channels can only be joined through invitations',
        );
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

        const lastMessageContent =
          lastMessage?.content ?? 'There are no messages';

        return {
          id: channel.id,
          name: channel.name,
          image: channel.image,
          lastMessage: lastMessageContent,
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
      data: sendMessageDto,
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
