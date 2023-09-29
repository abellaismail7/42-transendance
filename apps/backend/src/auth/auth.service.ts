import { ExecutionContext, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import * as cookieParser from 'cookie-parser'


@Injectable()
export class AuthService {
  login(res: Response) {
    //if (request.cookies)
    res.cookie('token', 'valid_token', {
      httpOnly: true,
      secure: false,
    })
  }

  loginView() {
    return `<form method="post" action="/auth/login"><button>submit</button></form>`;
  }

  logout (res: Response) {
    try{
      res.clearCookie('token')
      console.log('cookie cleared successfully');
      res.redirect('/');
    }
    catch (e) {
      console.log((e as Error).message);
  }
  }

  logoutView(){
    return `<form method="post" action="/auth/logout"><button>submit</button></form>`;
  }

  
}
