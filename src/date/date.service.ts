import { Injectable } from '@nestjs/common';
import { z } from 'zod';

// The date schema as you defined
export const dateSchema = z.string().transform((val) => {
  const date = new Date(val);
  if (!date.getTime()) {
    return z.NEVER;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
});

@Injectable()
export class DateService {
  validateDate(date: string): string {
    try {
      return dateSchema.parse(date);
    } catch (error) {
      throw new Error('Invalid date format. Please provide a valid date.');
    }
  }
}
