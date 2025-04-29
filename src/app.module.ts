import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { DateModule } from './date/date.module';

@Module({
  imports: [AuthModule, UsersModule, CommentsModule, TagsModule, AdminModule, PrismaModule, PostsModule, LikesModule, DateModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
