import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Creates a new comment for a post
     * @param postId - The ID of the post to comment on
     * @param userId - The ID of the user creating the comment
     * @param createCommentDto - The comment data transfer object containing the content
     * @returns The created comment record
     */
    async createComment(postId: number, userId: number, createCommentDto: CreateCommentDto) {
        
        const post = await this.prisma.post.findUnique({
            where: {
                id: postId
            },
            // select: {
            //     id: true,
            // }
        });

        if (!post) throw new NotFoundException('Post not found');

        // if it a reply to another comment, check if the parent comment exists
        if (createCommentDto.parentId) {
            const parentComment  = await this.prisma.comment.findUnique({
                where: {
                    id: createCommentDto.parentId
                }
            })

            if (!parentComment) throw new NotFoundException('Parent comment not found');
        }
        
        const comment = await this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                postId,
                userId,
                parentId: createCommentDto.parentId ?? null
            }
        })

        const {createdAt: _ , ...commentWithoutTimestamp} = comment;

        return commentWithoutTimestamp;
    }

    /**
     * Deletes a comment by its ID
     * @param commentId - The ID of the comment to delete
     * @param userId - The ID of the user deleting the comment
     * @returns The deleted comment record
     */
    async deleteComment(commentId: number, userId: number) {
        const comment = await this.prisma.comment.findUnique(
            {
                where: {
                    id: commentId,
                },
                include: {
                    post: {
                        select: {
                            userId: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        );

        if (!comment) throw new NotFoundException('Comment not found');

        // get the requesting user
        const requestingUser = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                role: true,
            }
        })

        const isCommentOwner = comment.userId === userId;
        const isPostOwner = comment.post.userId === userId;
        const isAdmin = requestingUser?.role === 'ADMIN';

        if (!isCommentOwner && !isPostOwner && !isAdmin) throw new ForbiddenException('You are not allowed to delete this comment');

        return this.prisma.comment.delete({
            where: {
                id: commentId,
            }
        })
    }

    async getCommentsByPost(postId: number) {

        const topLevelComment = await this.prisma.comment.findMany({
            where: {
                postId,
                parentId: null,
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        // Fetch replies recursively
        const fetchReplies= await Promise.all(
            topLevelComment.map(async (comment) => {
                const replies = await this.getReplies(comment.id);
                return {
                    ...comment,
                    replies,
                }
            })
        )

        return fetchReplies;
    }

    // helper recursive function to fetch replies
    private async getReplies(commentId: number): Promise<any[]> {
        const replies = await this.prisma.comment.findMany({
            where: {
                parentId: commentId,
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        // recursive call for each reply
        return Promise.all(
            replies.map(async (reply) => {
                const nested = await this.getReplies(reply.id);
                return {
                    ...reply,
                    replies: nested,
                }
            })
        );
        
    }
}
