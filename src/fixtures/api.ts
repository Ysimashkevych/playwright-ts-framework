import { test as base, expect } from '@playwright/test';
import { PostsClient } from '@api/PostsClient';

export const test = base.extend<{ posts: PostsClient }>({
  posts: async ({ request }, use) => use(new PostsClient(request)),
});

export { expect };
