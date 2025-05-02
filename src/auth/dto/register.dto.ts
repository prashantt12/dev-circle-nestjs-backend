import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const registerDto = z.object(
    {
        email: z.string().email(),
        name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
        password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
        role: z.enum(['USER', 'ADMIN']).optional()
    }
)

export class RegisterDto extends createZodDto(registerDto) {}