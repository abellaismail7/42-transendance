import { Injectable } from '@nestjs/common';
//import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
//import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
//import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async localValidation(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    if (password !== user.password) {
      return null;
    }
    return user;
  }

  async _42Validation(payload: any) {
    let user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      user = await this.userService.create({
        name: payload.displayName,
        login: payload.login,
        email: payload.email,
        username: payload.login,
        image: payload.image_url,
      });
    }
    return user;
  }

  async waitTfa(res: Response, user: User) {
    //sign the token that we have before the tfa
    const payload = { id: user.id, username: user.username };
    const token = this.jwtService.sign(payload);
    console.log('waitTfa');
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 3600000,
      })
      .redirect('http://localhost:3000/tfa');
  }

  async jwtValidation(payload: any) {
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async login(res: Response, user: User, tfaCode: string) {
    if (tfaCode) {
      this.userService.fulfillTfa(user.id, tfaCode);
    }
    //const payload = { id: user.id, username: user.username };
    const token = this.jwtService.sign(user);
    console.log('login');
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 3600000,
    });
  }

  loginAssert() {
    return 'login success';
  }
}
