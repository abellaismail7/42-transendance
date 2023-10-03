import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { z } from 'zod';

import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000' });

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChannelsMessagesGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join_channel')
  handleJoinChannel(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const result = z.string().uuid().safeParse(data);
    
    if (result.success) {
      client.join(result.data);
    }

    // TODO(saidooubella): report parsing errors to the client.
  }

  @SubscribeMessage('leave_channel')
  handleLeaveChannel(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const result = z.string().uuid().safeParse(data);

    if (result.success) {
      client.leave(result.data);
    }

    // TODO(saidooubella): report parsing errors to the client.
  }

  @SubscribeMessage('send_channel_message')
  async handleSendChannelMessage(
    @MessageBody() data: any,
  ) {
    const result = z
      .object({
        channelId: z.string().uuid(),
        senderId: z.string().uuid(),
        content: z.string(),
      })
      .safeParse(data);

    if (result.success) {
      await api.post("/channels/messages", result.data);
      this.server.to(result.data.channelId).emit('reload_messages');
    }

    // TODO(saidooubella): report axios and parsing errors to the client.
  }
}
