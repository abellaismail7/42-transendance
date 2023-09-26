import { ExecutionContext, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';


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
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
    })
  }

  logoutView(){
    return `<form method="post" action="/auth/logout"><button>submit</button></form>`;
  }

  
}
