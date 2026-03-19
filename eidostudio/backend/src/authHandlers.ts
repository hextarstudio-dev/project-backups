import { Env } from './db';
import { signToken } from './tokenUtils';
import { hashPassword, verifyPassword } from './cryptoUtils';

// Wave 4: Security improvements
const ALLOWED_ORIGINS = [
  'http://localhost:8791',
  'https://eidostudio.com.br',
  'https://hub.eidostudio.com.br',
  'https://api.eidostudio.com.br'
];

function getCorsOrigin(requestOrigin?: string): string {
  if (!requestOrigin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];
}

// Wave 4: HttpOnly cookie builder
function buildSessionCookie(token: string, maxAgeSeconds = 604800): string {
  // 7 days = 604800 seconds
  return `eidos_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;
}

// Wave 4: User data cookie (not HttpOnly - readable by JS for UI)
function buildUserCookie(userData: any, maxAgeSeconds = 604800): string {
  return `eidos_user=${encodeURIComponent(JSON.stringify(userData))}; Path=/; Max-Age=${maxAgeSeconds}; Secure; SameSite=Lax`;
}

// Wave 4: Auth indicator cookie (not HttpOnly - readable by JS)
function buildAuthCookie(maxAgeSeconds = 604800): string {
  return `eidos_auth=true; Path=/; Max-Age=${maxAgeSeconds}; Secure; SameSite=Lax`;
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const { email, password } = await request.json() as { email: string; password: string };

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Buscar usuário no banco
    const user = await env.DB.prepare(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Verificar senha com PBKDF2 (suporta texto plano legado)
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Buscar dados do hub_user se existir
    const hubUser = await env.DB.prepare(
      'SELECT * FROM hub_users WHERE user_id = ?'
    ).bind(user.id).first();

    // Wave 4: Gerar token JWT assinado com HMAC-SHA256
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: expiresAt
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hubProfile: hubUser
    };

    // Wave 4: Return token in HttpOnly cookie + user data in regular cookie
    const origin = request.headers.get('origin') || '';
    return new Response(JSON.stringify({
      success: true,
      expiresAt,
      user: userData
      // Note: No 'token' in body - it's in HttpOnly cookie
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(origin),
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': [
          buildSessionCookie(token),
          buildUserCookie(userData),
          buildAuthCookie()
        ].join(', ')
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      error: 'Login failed',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function handleRegister(request: Request, env: Env): Promise<Response> {
  try {
    const { email, password, name, phone } = await request.json() as { email: string; password: string; name: string; phone?: string };

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Email, password and name are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters long' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Verificar se usuário já existe
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Gerar ID único
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Criar usuário com hash PBKDF2
    const passwordHash = await hashPassword(password);

    await env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, 'user')
    `).bind(userId, email, passwordHash, name).run();

    // Criar perfil no hub
    await env.DB.prepare(`
      INSERT INTO hub_users (user_id, name, email, phone, role)
      VALUES (?, ?, ?, ?, 'Cliente')
    `).bind(userId, name, email, phone || null).run();

    // Wave 4: Gerar token JWT assinado com HMAC-SHA256
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    const token = await signToken({
      id: userId,
      email: email,
      role: 'user',
      exp: expiresAt
    });

    const userData = {
      id: userId,
      email: email,
      name: name,
      phone: phone || null,
      role: 'user'
    };

    // Wave 4: Return token in HttpOnly cookie
    const origin = request.headers.get('origin') || '';
    return new Response(JSON.stringify({
      success: true,
      expiresAt,
      message: 'User created successfully',
      user: userData
      // Note: No 'token' in body - it's in HttpOnly cookie
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(origin),
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': [
          buildSessionCookie(token),
          buildUserCookie(userData),
          buildAuthCookie()
        ].join(', ')
      },
    });

  } catch (error: any) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({
      error: 'Registration failed',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Wave 4: Logout endpoint
export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('origin') || '';

  // Clear all auth cookies
  return new Response(JSON.stringify({ success: true, message: 'Logged out successfully' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCorsOrigin(origin),
      'Access-Control-Allow-Credentials': 'true',
      'Set-Cookie': [
        'eidos_token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
        'eidos_user=; Path=/; Max-Age=0; Secure; SameSite=Lax',
        'eidos_auth=; Path=/; Max-Age=0; Secure; SameSite=Lax'
      ].join(', ')
    }
  });
}

// === GOOGLE OAUTH 2.0 ===
// Wave 4: CSRF protection - in-memory state storage
const oauthStates = new Map<string, { timestamp: number; codeVerifier: string }>();

// Wave 4: Cleanup expired states every minute
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [state, data] of oauthStates.entries()) {
    if (now - data.timestamp > 600000) { // 10 minutes
      oauthStates.delete(state);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[OAuth] Cleaned ${cleaned} expired states`);
  }
}, 60000);

// Wave 4: Generate random strings for OAuth security
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Wave 4: SHA256 hash for PKCE code_challenge
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function handleGoogleAuth(request: Request, env: Env): Promise<Response> {
  const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID?.trim();
  const REDIRECT_URI = env.GOOGLE_REDIRECT_URI?.trim() || 'http://localhost:8787/api/auth/google/callback';

  if (!GOOGLE_CLIENT_ID) {
    return new Response('No Google Client ID configured', { status: 500 });
  }

  // Wave 4: CSRF protection - generate state and PKCE
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier);

  // Store state with code verifier
  oauthStates.set(state, {
    timestamp: Date.now(),
    codeVerifier
  });

  const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  oauthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  oauthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  oauthUrl.searchParams.set('response_type', 'code');
  oauthUrl.searchParams.set('scope', 'openid email profile');
  oauthUrl.searchParams.set('access_type', 'online');
  oauthUrl.searchParams.set('prompt', 'select_account');
  // Wave 4: Add CSRF protection
  oauthUrl.searchParams.set('state', state);
  oauthUrl.searchParams.set('code_challenge', codeChallenge);
  oauthUrl.searchParams.set('code_challenge_method', 'S256');

  // Redireciona o usuário para o Google
  return Response.redirect(oauthUrl.toString(), 302);
}

export async function handleGoogleCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID?.trim();
  const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET?.trim();
  const REDIRECT_URI = env.GOOGLE_REDIRECT_URI?.trim() || 'http://localhost:8787/api/auth/google/callback';
  const FRONTEND_URL = env.FRONTEND_URL?.trim() || 'http://localhost:5173';

  if (!code || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return Response.redirect(`${FRONTEND_URL}/login?error=OAuth Configuration Error`, 302);
  }

  // Wave 4: Validate state (CSRF protection)
  if (!state) {
    console.error('[OAuth] Missing state parameter');
    return Response.redirect(`${FRONTEND_URL}/login?error=Invalid OAuth state`, 302);
  }

  const storedData = oauthStates.get(state);
  if (!storedData) {
    console.error('[OAuth] State not found or already used');
    return Response.redirect(`${FRONTEND_URL}/login?error=Invalid or expired OAuth state`, 302);
  }

  // Check if state is expired (max 10 minutes)
  if (Date.now() - storedData.timestamp > 600000) {
    oauthStates.delete(state);
    console.error('[OAuth] State expired');
    return Response.redirect(`${FRONTEND_URL}/login?error=OAuth state expired`, 302);
  }

  // Use state only once (prevent replay attacks)
  oauthStates.delete(state);

  try {
    // Wave 4: Exchange code for token with PKCE code_verifier
    const tokenParams: Record<string, string> = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: storedData.codeVerifier
    };

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams).toString()
    });

    const tokens: any = await tokenResponse.json();
    if (!tokens.access_token) {
      throw new Error('Failed to obtain Google access token');
    }

    // 2. Buscar dados do usuário da API do Google consumindo o Token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const googleUser: any = await userInfoResponse.json();
    if (!googleUser.email) {
      throw new Error('Failed to obtain user email');
    }

    // 3. Cadastrar ou Logar o usuário
    let user = await env.DB.prepare('SELECT id, email, name, role FROM users WHERE email = ?').bind(googleUser.email).first();
    let userId = user?.id;

    if (!user) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      // Criar conta na tabela principal
      await env.DB.prepare(`
        INSERT INTO users (id, email, password_hash, name, role)
        VALUES (?, ?, ?, ?, 'user')
      `).bind(userId, googleUser.email, 'GOOGLE_OAUTH', googleUser.name).run();

      // Criar conta na tabela do Hub
      await env.DB.prepare(`
        INSERT INTO hub_users (user_id, name, email, role, avatar_url)
        VALUES (?, ?, ?, 'Cliente', ?)
      `).bind(userId, googleUser.name, googleUser.email, googleUser.picture || null).run();

      user = { id: userId, email: googleUser.email, name: googleUser.name, role: 'user' };
    }

    // Wave 4: Gerar token interno do sistema
    const hubUser = await env.DB.prepare('SELECT * FROM hub_users WHERE user_id = ?').bind(userId).first();
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    const systemToken = await signToken({
      id: userId,
      email: googleUser.email,
      role: user.role,
      exp: expiresAt
    });

    const finalUserPayload = {
      id: userId,
      email: googleUser.email,
      name: googleUser.name,
      role: user.role,
      avatarUrl: hubUser?.avatar_url || googleUser.picture || null,
      hubProfile: hubUser
    };

    // Wave 4: Redirect with cookies (no token in URL)
    const targetUrl = new URL(`${FRONTEND_URL}/auth-callback`);
    targetUrl.searchParams.set('success', 'true');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': targetUrl.toString(),
        'Set-Cookie': [
          buildSessionCookie(systemToken),
          buildUserCookie(finalUserPayload),
          buildAuthCookie()
        ].join(', ')
      }
    });
  } catch (error: any) {
    console.error('Google OAuth Callback error:', error);
    return Response.redirect(`${FRONTEND_URL}/login?error=Google Auth Failed`, 302);
  }
}
