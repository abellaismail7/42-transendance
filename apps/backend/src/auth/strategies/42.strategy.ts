import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authservive: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        login: 'login',
        displayName: 'displayname',
        last_name: 'last_name',
        first_name: 'first_name',
        profileUrl: 'url',
        email: 'email',
        phone: 'phone',
        image_url: 'image.link',
      },
    });
  }

  async validate(accessToken, refreshToken, profile, cb) {
    const user = await this.authservive._42Validation(profile);
    if (!user) {
      throw new Error('No profile from 42');
    }
    if (!accessToken) {
      throw new Error('No access token from 42');
    }
    console.log('42 strategy');
    return cb(null, user);
  }
}
