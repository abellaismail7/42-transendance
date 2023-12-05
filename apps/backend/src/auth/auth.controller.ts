import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/guard';
import { LocalAuthGuard } from './guards/local.guard';
import { Response } from 'express';
import { FortyTwoAuthGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // @UseGuards(LocalAuthGuard)
  // login(@Request() req, @Res({ passthrough: true }) res: Response) {
  //   return this.authService.login(res, req.user);
  // }

  @Get('login-42') //no body
  @UseGuards(FortyTwoAuthGuard)
  login42() {}

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  login42Callback(@Res({ passthrough: true }) res: Response, @Request() req) {
    return this.authService.waitTfa(res, req.user);
  }

  @Post('tfavalidation')
  @UseGuards(JwtAuthGuard)
  tfaValidation(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    return this.authService.login(res, req.user, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login-assert')
  loginAssert() {
    return this.authService.loginAssert();
  }
}
