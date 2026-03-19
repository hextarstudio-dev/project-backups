import { PostgresDatabase } from './postgres';

export interface R2Like {
  put(key: string, body: any, opts?: { httpMetadata?: { contentType?: string } }): Promise<void>;
  delete(key: string): Promise<void>;
  list(params: { prefix?: string; limit?: number }): Promise<{
    objects: Array<{ key: string; size?: number; uploaded?: Date; etag?: string }>;
  }>;
}

export interface Env {
  DB: PostgresDatabase;
  R2: R2Like;
  FRONTEND_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  R2_PUBLIC_URL: string;
  SUPABASE_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
}
