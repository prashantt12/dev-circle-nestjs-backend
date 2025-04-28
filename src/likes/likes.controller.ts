import { Controller, Delete, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'generated/prisma';

@Controller('posts/:id/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async likePost(@Param('id', ParseIntPipe) postId: number, @Req() req: Request & { user: User}) {
    return this.likesService.likePost(postId, req.user.id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async unlikePost(@Param('id', ParseIntPipe) postId: number, @Req() req: Request & { user: User}) {
    return this.likesService.unlikePost(postId, req.user.id);
  }
}
