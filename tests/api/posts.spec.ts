import { test, expect } from '@fixtures/api';
import { isPost, type Post } from '@api/schemas';

test.describe('JSONPlaceholder /posts', () => {
  test('GET /posts returns 100 posts matching the contract', async ({ posts }) => {
    const res = await posts.list();
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const body: unknown[] = await res.json();
    expect(body).toHaveLength(100);
    expect(body.every(isPost)).toBe(true);
  });

  test('GET /posts/1 returns the expected post', async ({ posts }) => {
    const res = await posts.get(1);
    expect(res.ok()).toBe(true);
    const body: unknown = await res.json();
    expect(isPost(body)).toBe(true);
    expect((body as Post).id).toBe(1);
  });

  test('GET /posts?userId=1 filters by user', async ({ posts }) => {
    const body: Post[] = await (await posts.list({ userId: 1 })).json();
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
    expect(await res.json()).toMatchObject({ ...payload, id: 101 });
  });

  test('PUT /posts/1 returns the updated resource', async ({ posts }) => {
    const data: Post = { id: 1, userId: 1, title: 'updated', body: 'changed' };
    const res = await posts.update(1, data);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(data);
  });

  test('DELETE /posts/1 returns 200', async ({ posts }) => {
    expect((await posts.remove(1)).status()).toBe(200);
  });
});

test.describe('JSONPlaceholder /users contract', () => {
  test('GET /users/1 exposes required fields', async ({ request }) => {
    const res = await request.get('/users/1');
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({
      id: 1,
      name: expect.any(String),
      username: expect.any(String),
      email: expect.stringMatching(/^[^@\s]+@[^@\s]+$/),
    });
  });
});
