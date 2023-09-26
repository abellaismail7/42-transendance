import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    //set cookie - check cookie if exist and if valid 
    canActivate(context: ExecutionContext): boolean{
        const request =  context.switchToHttp().getRequest();
        const token = request.cookies.token as string;
        request.user = {
            name: "ismail",
        };
        if (token != 'valid_token') throw new UnauthorizedException()
        return true;
    }
}