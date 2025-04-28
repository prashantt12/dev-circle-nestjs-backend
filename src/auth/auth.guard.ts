import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'];

    if(!token) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.getUserFromToken(token);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;  //attatching user to the request object
    
    return true;
  }
}
