import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtAuth') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: 'PASSWORD',
      ignoreExpiration: false,
      // secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return await this.authService.jwtValidation(payload);
    // return { id: payload.id, username: payload.username };
  }

  private static extractJWT(req: Request): string | null {
    console.log('extractJWT');
    if (
      req.cookies &&
      'token1' in req.cookies &&
      req.cookies.token1.length > 0
    ) {
      //console.log(req.cookies.token1);
      return req.cookies.token1;
    }
    return null;
  }

  // async extractPayload(req: Request) {
  //   console.log()
  //   const token = JwtStrategy.extractJWT(req);
  //   console.log('extractPayload', token);
  //   if (token) {
  //     const claims = atob(token.split('.')[1]);
  //     console.log(claims);
  //     return JSON.parse(claims);
  //   }
  //   return null;
  // }
}
