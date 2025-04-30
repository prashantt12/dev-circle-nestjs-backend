import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'generated/prisma';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/post/:id')
  @UseGuards(AuthGuard)
  async createComment(@Param('id', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto, @Req() req: Request & { user: User}) {
    return this.commentsService.createComment(postId, req.user.id, createCommentDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id', ParseIntPipe) commentId: number, @Req() req: Request & { user: User}) {
    return this.commentsService.deleteComment(commentId, req.user.id)
  }

  @Get('/post/:id')
  async getCommentsByPost(@Param('id', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsByPost(postId);
  }

}
