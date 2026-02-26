import { z } from 'zod';

export const CreateLogSchema = z.object({
  habitId: z.number(),
  date: z.string().optional(),
  note: z.string().max(200).optional(),
});
