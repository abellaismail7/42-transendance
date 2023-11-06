import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Server } from 'socket.io';
import { MoveBallDto } from './dto/move.dto';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('movePaddle')
  create(@MessageBody() createGameDto: CreateGameDto) {
    this.server.emit('movePaddle', this.gameService.create(createGameDto));
  }

  @SubscribeMessage('moveBall')
  moveBall(@MessageBody() moveBallDto: MoveBallDto) {
    return this.gameService.moveBall(moveBallDto);
  }

  @SubscribeMessage('startGame')
  startGame() {
    this.server.emit('gameStatus', this.gameService.gameStatus(1));
    setInterval(() => {
      const ball = this.gameService.updateBall();
      this.server.emit('moveBall', ball);
    }, 1000 / 24);
  }

  @SubscribeMessage('debug')
  update() {
    return this.gameService.debug();
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
