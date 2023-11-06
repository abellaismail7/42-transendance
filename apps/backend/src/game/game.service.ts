import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { MoveBallDto } from './dto/move.dto';
import { Vec } from './game.utils';
import { GAME_CONFIG } from 'src/config';

const pitch = {
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

type Pitch = typeof pitch;

export function add_in(x: number, add: number, min: number, max: number) {
  if (x + add < min) return min;
  if (x + add > max) return max;
  return x + add;
}

export function inRange(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export function paddleCollision(
  ball: Pitch['ball'],
  paddleY: number,
  dir: number,
) {
  const paddleW = GAME_CONFIG.worldWidth * GAME_CONFIG.paddleSizeX;
  const paddleH2 = GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY * 0.5;
  const w2 = (dir * GAME_CONFIG.worldWidth) / 2 + paddleW * -dir;
  return (
    ball.pos.x < w2 &&
    inRange(ball.pos.y, paddleY - paddleH2, paddleY + paddleH2)
  );
}

@Injectable()
export class GameService {
  create(createGameDto: CreateGameDto) {
    const h2 =
      GAME_CONFIG.worldHeight / 2 -
      0.5 * GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY;
    if (createGameDto.dir == 1) {
      pitch.paddle.leftY = add_in(pitch.paddle.leftY, 0.4, -h2, h2);
    } else {
      pitch.paddle.leftY = add_in(pitch.paddle.leftY, -0.4, -h2, h2);
    }
    return pitch.paddle;
  }

  moveBall(_moveBall: MoveBallDto) {
    return `This action returns all game`;
  }

  gameStatus(status: number) {
    pitch.status = status;
    pitch.ball.dir = Vec(1, 1, 0).norm();
    pitch.ball.pos = Vec();
    return pitch;
  }

  updateBall() {
    const h2 = GAME_CONFIG.worldHeight / 2;
    const w2 = GAME_CONFIG.worldWidth / 2;
    pitch.ball.pos = pitch.ball.pos.add(pitch.ball.dir.mul(0.4));
    const paddleW = (GAME_CONFIG.worldWidth * GAME_CONFIG.paddleSizeX) / 2;
    const goal = {
      left: pitch.ball.pos.x < -w2 + paddleW,
      right: pitch.ball.pos.x > w2 + paddleW,
    };
    if (pitch.ball.pos.y > h2) {
      pitch.ball.dir = pitch.ball.dir.reflect(Vec(0, -1, 0));
    } else if (pitch.ball.pos.y < -h2) {
      pitch.ball.dir = pitch.ball.dir.reflect(Vec(0, 1, 0));
    } else if (
      goal.right
      //paddleCollision(pitch.ball, pitch.paddle.rightY, -3.5)
    ) {
      pitch.ball.dir = pitch.ball.dir.reflect(Vec(1, 0, 0));
    } else if (
      goal.left ||
      paddleCollision(pitch.ball, pitch.paddle.leftY, -1)
    ) {
      pitch.ball.dir = pitch.ball.dir.reflect(Vec(-1, 0, 0));
    }

    if (goal.right || goal.left) {
      pitch.ball.pos = Vec();
    }

    return {
      pos: pitch.ball.pos.pure(),
      goal,
    };
  }

  debug() {
    console.log(pitch);
    console.log(GAME_CONFIG);
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }

  config() {
    return GAME_CONFIG;
  }
}
