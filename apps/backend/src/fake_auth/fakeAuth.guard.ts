import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"


@Injectable()
export class AuthGuard implements CanActivate{
constructor(private reflector: Reflector){}
//set cookie - check cookie if exist and if valid 
canActivate(context: ExecutionContext): boolean{
    const request =  context.switchToHttp().getRequest();
    return request.headers?.authorization === 'valid_token';
}
}