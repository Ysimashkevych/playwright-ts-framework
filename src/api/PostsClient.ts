import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Post } from './schemas';

/** Thin typed wrapper over the /posts resource. */
export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params?: { userId?: number }): Promise<APIResponse> {
    return this.request.get('/posts', { params });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/posts/${id}`);
  }

  create(data: Omit<Post, 'id'>): Promise<APIResponse> {
    return this.request.post('/posts', { data });
  }

  update(id: number, data: Post): Promise<APIResponse> {
    return this.request.put(`/posts/${id}`, { data });
  }

  remove(id: number): Promise<APIResponse> {
    return this.request.delete(`/posts/${id}`);
  }
}
