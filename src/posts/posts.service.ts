import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new post with the given user ID and post data
   * 
   * @param userId - The ID of the user creating the post
   * @param createPostDto - The post data containing title, content, tags, and published status
   * @returns A Promise resolving to the created post
   *
   * @example
   * const post = await createPost(1, {
   *   title: "My Post",
   *   content: "Post content...", 
   *   tags: ["tag1", "tag2"],
   *   published: true
   * });
   */
  async createPost(userId: number, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        userId,
        tags: {
          connectOrCreate: createPostDto.tags?.map(tag => ({ 
            where: {name: tag},
            create: {name: tag}
          }))
        },
        published: createPostDto.published
      }
    })
  }

  /**
   * Retrieves all posts with related user, comments, likes and tags data
   * 
   * @returns A Promise resolving to an array of posts with included relations
   * 
   * @example
   * const posts = await getAllPosts();
   * // Returns array of posts with user names, comments, likes and tags
   */
  async getAllPosts() {
    return this.prisma.post.findMany({
      select: {
        title: true,
        content: true,
        published: true,
        user: {
          select: {
            name: true,
          }
        },
        comments: {
          select: {
            content: true,
            user: {
              select: {
                name: true
              }
            }
          }
        },
        likes: true,
        tags: true,
      }
    })
  }

  /**
   * Retrieves a single post by its ID with related data
   * 
   * @param id - The unique identifier of the post to retrieve
   * @returns A Promise resolving to the post with included relations, or null if not found
   * 
   * @example
   * const post = await getPostById(1);
   * // Returns post with user name, comments, likes and tags
   */
  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
        }
      },
      comments: {
        select: {
          content: true,
          user: {
            select: {
              name: true
            }
          }
        }
      },
      likes: true,
      tags: true,
    }
    })
  }
  
  /**
   * Updates an existing post with the given ID using the provided update data
   * 
   * @param id - The unique identifier of the post to update
   * @param dto - The update data containing title, content, published status, and tags
   * @returns A Promise resolving to the updated post
  */
  async updatePost(id: number, dto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
        tags: {
          connect: dto.tags?.map(tag => ({ name: tag}))
        },
      }
    })
  } 

  /**
   * Deletes a post with the given ID
   * 
   * @param id - The unique identifier of the post to delete
   * @returns A Promise resolving to the deleted post
  */
  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id },
    })
  }
  
}
