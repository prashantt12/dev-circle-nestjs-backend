import { z } from "zod";

export const createPostDto = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters long"}),
    content: z.string().min(10, { message: "Content must be at least 10 characters long"}),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false)
})

export type CreatePostDto = z.infer<typeof createPostDto>
