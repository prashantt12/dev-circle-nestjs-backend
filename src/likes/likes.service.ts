import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private readonly prisma: PrismaService) {}
    

    /**
     * Likes a post for a user
     * @param postId - The ID of the post to like
     * @param userId - The ID of the user liking the post
     * @returns The created like record
     * @throws {NotFoundException} When the post is not found
     * @throws {BadRequestException} When the user has already liked the post
     */
    async likePost(postId: number, userId: number) {
        
        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            }
        });

        if (!post) throw new NotFoundException('Post not found');

        const existingLike = await this.prisma.like.findFirst({
            where: {
                postId,
                userId,
            }
        });

        if (existingLike) throw new BadRequestException('You have already liked this post');
        
        return this.prisma.like.create({
            data: {
                postId,
                userId
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                post: {
                    select: {
                        title: true,
                        content: true,
                    }
                }
            }
        });
    }

    /**
     * Unlikes a post for a user
     * @param postId - The ID of the post to unlike
     * @param userId - The ID of the user unliking the post
     * @returns The deleted like record
     * @throws {BadRequestException} When the user has not liked the post
     */
    async unlikePost(postId: number, userId: number) {

        const existingLike = await this.prisma.like.findFirst({
            where: {
                postId,
                userId
            }
        });

        if (!existingLike) throw new BadRequestException('You have not liked this post');

        return this.prisma.like.delete({
            where: {
                id: existingLike.id
            }
        });
    }
}
