import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as cookieParser from 'cookie-parser';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { FortyTwoStrategy } from './strategies/42.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({
      secret: 'PASSWORD',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    JwtStrategy,
    LocalStrategy,
    FortyTwoStrategy,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
