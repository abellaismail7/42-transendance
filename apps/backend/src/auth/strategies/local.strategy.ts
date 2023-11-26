import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authservive: AuthService) {
    super({});
  }

  async validate(email: string, password: string) {
    return await this.authservive.localValidation(email, password);
  }
}
