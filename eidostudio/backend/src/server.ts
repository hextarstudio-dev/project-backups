import 'dotenv/config';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import worker from './index';
import type { Env } from './db';
import { NodeR2Bucket } from './r2-node';
import { PostgresDatabase } from './postgres';

const port = Number(process.env.PORT || 8787);

function dummyR2() {
  return {
    async put() { throw new Error('R2 not configured'); },
    async delete() { throw new Error('R2 not configured'); },
    async list() { throw new Error('R2 not configured'); }
  };
}


function buildEnv(): Env {
  const env: Env = {
    DB: new PostgresDatabase(process.env.SUPABASE_URL || ''),
    R2: (() => { try { return new NodeR2Bucket(); } catch { return dummyR2() as any; } })(),
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://eidostudio.com.br',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || '',
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
  };
  return env;
}

const server = createServer(async (req, res) => {
  try {
    const host = req.headers.host || `localhost:${port}`;
    const url = `http://${host}${req.url || '/'}`;
    const method = req.method || 'GET';

    const requestInit: any = {
      method,
      headers: req.headers as HeadersInit,
      body: method === 'GET' || method === 'HEAD' ? undefined : (Readable.toWeb(req) as unknown as BodyInit),
      duplex: 'half' as any
    };

    const request = new Request(url, requestInit);

    const response = await worker.fetch(request, buildEnv(), {} as any);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (!response.body) {
      res.end();
      return;
    }

    Readable.fromWeb(response.body as any).pipe(res);
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal_server_error', details: error?.message || String(error) }));
  }
});

server.listen(port, () => {
  console.log(`[eidos-backend] running on http://0.0.0.0:${port}`);
});
