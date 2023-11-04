import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto, @Res({passthrough: true}) response: Response) {
    return this.authService.login(response);
  }

  @Get('login')
  loginView() {
    return this.authService.loginView();
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('logout')
  logoutView() {
    return this.authService.logoutView();
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  protected() {
    return 'whatever';
  }
}
