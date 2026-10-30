import { expect } from '@playwright/test';
import { z } from 'zod';

export const PostSchema = z.object({
  userId: z.number().int(),
  id: z.number().int(),
  title: z.string(),
  body: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

export const UserSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.email(),
});
export type User = z.infer<typeof UserSchema>;

/** Asserts that body matches the contract and returns it typed; the failure message lists every violation. */
export function expectContract<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  expect(result.success, result.error ? z.prettifyError(result.error) : undefined).toBe(true);
  return result.data as T;
}
