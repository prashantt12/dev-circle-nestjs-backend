import { z } from "zod";

export const createCommentDto = z.object({
    content: z.string().min(1, {message: 'Content is required'}),
    parentId: z.number().optional()
});

export type CreateCommentDto = z.infer<typeof createCommentDto>;