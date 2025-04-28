import { Controller, Post, Body, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(dto);
        const token = result.token;
        this.authService.setTokenCookie(res, token);
        return res.json(result);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        const result = await this.authService.logout(res);
        return res.json(result);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async me(@Req() req: any) {
        const user= req.user as User;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}
