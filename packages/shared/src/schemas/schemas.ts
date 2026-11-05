import { z } from 'zod';

// Example schema - replace with your actual types
export const PartySchema = z.object({
  id: z.string(),
  name: z.string(),
  // Add your fields
});

export type Party = z.infer<typeof PartySchema>;

// Request body for POST /example/user
export const CreateUserBodySchema = z.object({});
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;
