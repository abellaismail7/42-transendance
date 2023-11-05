import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { MoveBallDto } from './dto/move.dto';
import { Vec } from './game.utils';

const bitch = {
  width: 16,
  height: 9,
  status: 0,
  paddle: {
    leftY: 0,
    rightY: 0,
  },
  ball: {
    pos: Vec(),
    dir: Vec(1, 1, 0),
  },
};

export function add_in(x: number, add: number, min: number, max: number) {
  if (x + add < min) return min;
  if (x + add > max) return max;
  return x + add;
}

@Injectable()
export class GameService {
  create(createGameDto: CreateGameDto) {
    console.log(bitch.paddle.leftY);
    if (createGameDto.dir == 1) {
      bitch.paddle.leftY = add_in(bitch.paddle.leftY, 0.4, -11, 3);
    } else {
      bitch.paddle.leftY = add_in(bitch.paddle.leftY, -0.4, -11, 3);
    }
    console.log(bitch.paddle.leftY);
    return bitch.paddle;
  }

  moveBall(moveBall: MoveBallDto) {
    return `This action returns all game`;
  }

  gameStatus(status: number) {
    bitch.status = status;
    bitch.ball.dir = Vec(1, 1, 0);
    bitch.ball.pos = Vec();
    return bitch;
  }

  updateBall() {
    bitch.ball.pos = bitch.ball.pos.add(bitch.ball.dir.mul(0.1));
    if (bitch.ball.pos.y > 4) {
      bitch.ball.dir = bitch.ball.dir.reflect(Vec(0, -1, 0));
    } else if (bitch.ball.pos.y < -12) {
      bitch.ball.dir = bitch.ball.dir.reflect(Vec(0, 1, 0));
    } else if (bitch.ball.pos.x > 15) {
      bitch.ball.dir = bitch.ball.dir.reflect(Vec(1, 0, 0));
    } else if (bitch.ball.pos.x < -15) {
      bitch.ball.dir = bitch.ball.dir.reflect(Vec(-1, 0, 0));
    }
    return {
      pos: bitch.ball.pos.pure(),
    };
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
