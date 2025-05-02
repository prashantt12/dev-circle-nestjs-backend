import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const loginDto = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})

export class LoginDto extends createZodDto(loginDto) {}