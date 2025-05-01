import { ExpressAdapter } from "@nestjs/platform-express";
import { z } from "zod";

const createCommentDto = z.object({
    content: z.string().min(1, {message: 'Content is required'}),
    parentId: z.number().optional(),
});



export type CreateCommentDto = z.infer<typeof createCommentDto>;