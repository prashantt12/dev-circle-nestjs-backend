import { Controller, Post, Get, UseGuards, Body, Req, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'generated/prisma';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTag(@Body() dto: CreateTagDto, @Req() req: Request & { user: User}) {
    return this.tagsService.createTag(dto);
  }

  @Get('posts')
  async getPosts(@Query('tag') tag: string) {
    if (tag) {
      return this.tagsService.getPostsByTag(tag);
    }
    return this.tagsService.getAllTags();
  }
}
