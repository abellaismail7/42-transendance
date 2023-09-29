import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChannelsMessagesGateway implements OnModuleInit {
  @WebSocketServer()
  server!: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('new connection: ' + socket.id);
    });
  }

  @SubscribeMessage('messages')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.server.emit('messages', data);
    client.broadcast;
  }
}
