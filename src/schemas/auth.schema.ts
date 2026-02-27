import { z } from 'zod';

export const registerBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
});

export const loginBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const registerRequestSchema = z.object({
  body: registerBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginRequestSchema = z.object({
  body: loginBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;

