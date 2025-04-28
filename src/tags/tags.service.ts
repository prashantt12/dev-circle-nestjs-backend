import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllTags() {
        return this.prisma.tag.findMany();
    }

    async createTag(dto: CreateTagDto) {
        
        const existingTag = await this.prisma.tag.findUnique({
            where: {
                name: dto.name,
            },
        });
        
        if (existingTag) {
            throw new BadRequestException('Tag already exists');
        }
        
        return this.prisma.tag.create({
            data: dto,
        });
    }

    async getPostsByTag(tagName: string) {
        return this.prisma.post.findMany({
          where: {
            tags: {
              some: {
                name: tagName,
              },
            },
          },
          include: {
            user: true,
            tags: true,
            comments: true,
            likes: true,
          },
        });
      }
}
