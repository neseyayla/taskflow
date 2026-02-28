import { z } from 'zod';

export const createWorkspaceBodySchema = z.object({
  name: z.string().min(1, 'Workspace name is required')
});

export const createWorkspaceRequestSchema = z.object({
  body: createWorkspaceBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceBodySchema>;

