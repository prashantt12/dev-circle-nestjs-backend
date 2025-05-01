import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';

interface RawCommentBody {
  content: string;
  parentId?: number;
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/post/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('attatchment')
  )
  async createComment(@Param('id', ParseIntPipe) postId: number, @Body() body: RawCommentBody, @Req() req: Request & { user: User }, @UploadedFile() file: Express.Multer.File) {
    return this.commentsService.createComment(postId, req.user.id, body, file)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id', ParseIntPipe) commentId: number, @Req() req: Request & { user: User}) {
    return this.commentsService.deleteComment(commentId, req.user.id)
  }

  // get only the top level comments for a post
  @Get('/post/:id')
  async getTopLevelComments(@Param('id', ParseIntPipe) postId: number) {
    return this.commentsService.getAllTopLevelComments(postId);
  }

  @Get('/postAndReplies/:id')
  async getCommentsByPost(@Param('id', ParseIntPipe) postId: number) {
    return this.commentsService.getCommentsAndRepliesByPost(postId);
  }

  // test controller to handle file upload
  @Post('/test/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.commentsService.testUploadFile(file);
  }

}
