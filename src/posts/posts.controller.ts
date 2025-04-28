import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { User } from 'generated/prisma';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // get all posts
  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  // get a single post by id
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(parseInt(id));
  }

  // create a new post (authentication required)
  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request & { user: User }) {
    const userId = req.user.id;
    return this.postsService.createPost(userId, createPostDto);
  }

  // update a post (authentication required)
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updatePost(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request & { user: User}) {
    const userId = req.user.id;
    const post = await this.postsService.getPostById(parseInt(postId));
    
    // Check if the post exists and if the user is the owner
    if (post && post.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    return this.postsService.updatePost(parseInt(postId), updatePostDto);
  }

  // delete a post (authentication required)
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') postId: string, @Req() req: Request & { user: User}) {
    const userId = req.user.id;
    const post = await this.postsService.getPostById(parseInt(postId));

    // Check if the post exists and if the user is the owner
    if (post && post.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return this.postsService.deletePost(parseInt(postId));
  }
}
