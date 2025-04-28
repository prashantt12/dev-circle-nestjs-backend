import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
  imports: [AuthModule]
})
export class LikesModule {}
