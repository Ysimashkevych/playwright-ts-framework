export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

/** Lightweight runtime contract check (no extra dependency). */
export function isPost(v: unknown): v is Post {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.userId === 'number' &&
    typeof o.id === 'number' &&
    typeof o.title === 'string' &&
    typeof o.body === 'string'
  );
}
