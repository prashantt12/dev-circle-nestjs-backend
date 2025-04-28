import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { z } from 'zod';

export const updatePostDto = z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
})

export type UpdatePostDto = z.infer<typeof updatePostDto>
