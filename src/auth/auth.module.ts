import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [PrismaModule]
})
export class AuthModule {}
