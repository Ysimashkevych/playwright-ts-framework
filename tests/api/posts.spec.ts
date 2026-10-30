import { test, expect } from '@fixtures/api';
import { expectContract, PostSchema, UserSchema, type Post } from '@api/schemas';

test.describe('JSONPlaceholder /posts', () => {
  test('GET /posts returns 100 posts matching the contract', async ({ posts }) => {
    const res = await posts.list();
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const body = expectContract(PostSchema.array(), await res.json());
    expect(body).toHaveLength(100);
  });

  test('GET /posts/1 returns the expected post', async ({ posts }) => {
    const res = await posts.get(1);
    expect(res.status()).toBe(200);
    const post = expectContract(PostSchema, await res.json());
    expect(post).toMatchObject({ id: 1, userId: 1 });
    expect(post.title.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 filters by user', async ({ posts }) => {
    const body = expectContract(PostSchema.array(), await (await posts.list({ userId: 1 })).json());
    expect(body.length).toBeGreaterThan(0);
    for (const p of body) expect(p.userId).toBe(1);
  });

  test('GET unknown post returns 404', async ({ posts }) => {
    const res = await posts.get(99999);
    expect(res.status()).toBe(404);
  });

  test('POST /posts echoes payload and assigns an id', async ({ posts }) => {
    const payload = { userId: 7, title: 'portfolio', body: 'hello' };
    const res = await posts.create(payload);
    expect(res.status()).toBe(201);
    expect(expectContract(PostSchema, await res.json())).toEqual({ ...payload, id: 101 });
  });

  test('PUT /posts/1 returns the updated resource', async ({ posts }) => {
    const data: Post = { id: 1, userId: 1, title: 'updated', body: 'changed' };
    const res = await posts.update(1, data);
    expect(res.status()).toBe(200);
    expect(expectContract(PostSchema, await res.json())).toEqual(data);
  });

  test('DELETE /posts/1 returns 200', async ({ posts }) => {
    expect((await posts.remove(1)).status()).toBe(200);
  });
});

test.describe('JSONPlaceholder /users contract', () => {
  // A single read-only check, so it uses the raw request fixture rather than a dedicated client.
  test('GET /users/1 exposes required fields', async ({ request }) => {
    const res = await request.get('/users/1');
    expect(res.status()).toBe(200);
    expect(expectContract(UserSchema, await res.json()).id).toBe(1);
  });
});
