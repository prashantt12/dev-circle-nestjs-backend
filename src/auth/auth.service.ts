import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(dto:  RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const role = dto.role && dto.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
                role: role
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        return {message: "User registered successfully", user}
        
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = await this.generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }
    }

    private async generateToken(userId: number): Promise<string> {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        return jwt.sign({
            sub: userId
        },
        secret, 
        {
            expiresIn: '10m'
        }
        )
    }

    async getUserFromToken(token: string) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
    
        try{
            const payload = jwt.verify(token, secret) as unknown as { sub: number };

            if (!payload || typeof payload.sub !== 'number') {
                throw new UnauthorizedException("Invalid token payload");
            }

            return this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
            })
        } catch (error) {
            throw new UnauthorizedException("Invalid token");
        }
    }


    // setting up the token as cookie
    setTokenCookie(res: Response, token: String) {
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 1000 * 100, // 100 minutes
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
    }

    async logout(res: Response) {
        res.clearCookie('token');
        return {
            message: 'Logged out successfully'
        }
    }
        
}
