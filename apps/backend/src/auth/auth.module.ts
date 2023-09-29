import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as cookieParser from 'cookie-parser';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
