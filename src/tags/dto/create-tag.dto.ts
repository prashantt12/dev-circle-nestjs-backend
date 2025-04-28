import { z } from "zod";

export const createTagDto = z.object({
    name: z.string().min(1),
});

export type CreateTagDto = z.infer<typeof createTagDto>;