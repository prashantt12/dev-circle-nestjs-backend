import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const createCommentDto = z.object({
    content: z.string().min(1, {message: 'Content is required'}).optional(),
    parentId: z.string().refine((val) => {
        console.log('refining');
        console.log(val, typeof val);
        return !isNaN(parseInt(val))
    }, {
        message: 'Parent ID must be a number'
    }).transform((val) => parseInt(val)).optional(),
});



export class CreateCommentDto extends createZodDto(createCommentDto) {}