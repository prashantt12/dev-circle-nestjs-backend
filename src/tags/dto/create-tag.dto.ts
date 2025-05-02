import { z } from "zod";
import { createZodDto } from "nestjs-zod";
export const createTagDto = z.object({  
    name: z.string().min(1),
});

export class CreateTagDto extends createZodDto(createTagDto) {}