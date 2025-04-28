import { Controller, ForbiddenException, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(parseInt(id));
    }

    @Get()
    @UseGuards(AuthGuard)
    async getAllUsers(@Req() req: Request & { user: User }) {
        const user = req.user;
        if(user.role !== 'ADMIN') {
            throw new ForbiddenException('You are not authorized to access this resource');
        }
        return this.usersService.getAllUsers();
    }
}
