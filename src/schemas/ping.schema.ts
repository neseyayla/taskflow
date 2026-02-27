import { z } from 'zod';

export const pingBodySchema = z.object({
  message: z.string().min(1, 'message is required')
});

export const pingRequestSchema = z.object({
  body: pingBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type PingBody = z.infer<typeof pingBodySchema>;

