import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
export const updatePostDto = z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
})

export class UpdatePostDto extends createZodDto(updatePostDto) {}
