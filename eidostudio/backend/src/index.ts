import { Env } from './db';
import { getProjects, addProject, updateProject, deleteProject, getServices, addService, updateService, deleteService, getCategories, addCategory } from './handlers';
import { createCheckoutSession, handleStripeWebhook } from './stripeHandlers';
import { getStorage, deleteStorageFile, deleteStorageFolder, setupStorage } from './storageHandlers';
import { handleUpload } from './uploadHandlers';
import { handleLogin, handleRegister, handleGoogleAuth, handleGoogleCallback, handleLogout } from './authHandlers';
import { getHubProducts, getHubUser, updateHubUser, deleteHubUserAvatar, getHubLessonComments, postHubLessonComment, deleteHubLessonComment, getHubUserPurchases, markHubLessonProgress } from './hubHandlers';
import { getHubNotifications, markNotificationRead, markAllNotificationsRead } from './notificationHandlers';
import { handleContactForm } from './contactHandlers';
import { PostgresDatabase } from './postgres';
import { getTokenPayload, unauthorizedResponse } from './tokenUtils';
// Wave 4: Security improvements
import { addSecurityHeaders, shouldApplySecurityHeaders } from './middleware/securityHeaders';
import { rateLimitMiddleware, loginLimiter, registerLimiter, apiLimiter } from './middleware/rateLimit';

// Wave 4: Helper that adds CORS + Security Headers
const withCors = (response: Response, corsHeaders: Record<string, string>) => {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));

  // Wave 4: Add security headers
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json') || contentType.includes('text/');

  if (isJson) {
    // Add security headers for JSON/HTML responses
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const requireAuth = async (request: Request) => {
  const tokenPayload = await getTokenPayload(request);
  if (!tokenPayload) return { ok: false as const, response: unauthorizedResponse() };
  return { ok: true as const, tokenPayload };
};

const requireAdmin = async (request: Request) => {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;
  if (auth.tokenPayload.role !== 'admin') {
    return { ok: false as const, response: unauthorizedResponse('Forbidden - Admin only') };
  }
  return auth;
};

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // Normalize path: connect repetitive slashes and remove trailing slash
    let pathname = url.pathname.replace(/\/+$/, '').replace(/\/+/g, '/');
    if (pathname === '') pathname = '/';


    // CORS headers helper
    const requestOrigin = request.headers.get('Origin') || '';
    const allowedOrigins = ['https://eidostudio.com.br', 'https://hub.eidostudio.com.br'];
    const corsOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : 'https://eidostudio.com.br';
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Inject Postgres wrapper if URL is present
    if (env.SUPABASE_URL) {
      env = { ...env, DB: new PostgresDatabase(env.SUPABASE_URL) };
    }

    // Route handling
    try {
      // Root or /api health check
      if (pathname === '/' || pathname === '/api') {
        return new Response(JSON.stringify({
          message: 'Eidos Studio API is online and operating normally.',
          status: 'operational',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        });
      }

      if (pathname === '/api/projects' && method === 'GET') {
        return withCors(await getProjects(request, env), corsHeaders);
      }
      if (pathname === '/api/projects' && method === 'POST') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await addProject(request, env), corsHeaders);
      }
      if (pathname.startsWith('/api/projects/') && method === 'PUT') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await updateProject(request, env), corsHeaders);
      }
      if (pathname.startsWith('/api/projects/') && method === 'DELETE') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await deleteProject(request, env), corsHeaders);
      }

      if (pathname === '/api/services' && method === 'GET') {
        return withCors(await getServices(request, env), corsHeaders);
      }
      if (pathname === '/api/services' && method === 'POST') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await addService(request, env), corsHeaders);
      }
      if (pathname.startsWith('/api/services/') && method === 'PUT') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await updateService(request, env), corsHeaders);
      }
      if (pathname.startsWith('/api/services/') && method === 'DELETE') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await deleteService(request, env), corsHeaders);
      }

      if (pathname === '/api/categories' && method === 'GET') {
        return withCors(await getCategories(request, env), corsHeaders);
      }
      if (pathname === '/api/categories' && method === 'POST') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await addCategory(request, env), corsHeaders);
      }


      // --- HUB ROUTES ---
      if (pathname === '/api/hub/products' && method === 'GET') {
        return withCors(await getHubProducts(request, env), corsHeaders);
      }
      if (pathname === '/api/hub/progress' && method === 'POST') {
        return withCors(await markHubLessonProgress(request, env), corsHeaders);
      }

      // Match /api/hub/users/:id
      if (pathname.startsWith('/api/hub/users/')) {
        const remaining = pathname.replace('/api/hub/users/', '');

        // Notifications
        if (remaining.endsWith('/notifications/read-all') && method === 'PUT') {
          return withCors(await markAllNotificationsRead(request, env), corsHeaders);
        }
        if (remaining.endsWith('/notifications') && method === 'GET') {
          return withCors(await getHubNotifications(request, env), corsHeaders);
        }

        // Check if it's /avatar delete
        if (remaining.endsWith('/avatar') && method === 'DELETE') {
          return withCors(await deleteHubUserAvatar(request, env), corsHeaders);
        }

        // Check if it's /purchases get
        if (remaining.endsWith('/purchases') && method === 'GET') {
          return withCors(await getHubUserPurchases(request, env), corsHeaders);
        }

        // Check simple ID operations
        if (!remaining.includes('/')) {
          if (method === 'GET') return withCors(await getHubUser(request, env), corsHeaders);
          if (method === 'PUT') return withCors(await updateHubUser(request, env), corsHeaders);
        }
      }
      // Match /api/hub/comments/:lessonId or /api/hub/comments/:lessonId/:commentId
      if (pathname.startsWith('/api/hub/comments/')) {
        if (method === 'GET') return withCors(await getHubLessonComments(request, env), corsHeaders);
        if (method === 'POST') return withCors(await postHubLessonComment(request, env), corsHeaders);
        if (method === 'DELETE') return withCors(await deleteHubLessonComment(request, env), corsHeaders);
      }
      // Match /api/hub/notifications/:id/read
      if (pathname.startsWith('/api/hub/notifications/') && pathname.endsWith('/read') && method === 'PUT') {
        return withCors(await markNotificationRead(request, env), corsHeaders);
      }
      // ------------------

      // Wave 4: Auth routes with rate limiting
      if (pathname === '/api/login' && method === 'POST') {
        const rateLimit = rateLimitMiddleware(request, loginLimiter);
        if (rateLimit) return withCors(rateLimit, corsHeaders);
        return withCors(await handleLogin(request, env), corsHeaders);
      }

      if (pathname === '/api/login' && method === 'GET') {
        return new Response(JSON.stringify({
          message: 'Login endpoint is working. Use POST method to login.',
          endpoints: {
            login: 'POST /api/login',
            register: 'POST /api/register'
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      if (pathname === '/api/register' && method === 'POST') {
        const rateLimit = rateLimitMiddleware(request, registerLimiter);
        if (rateLimit) return withCors(rateLimit, corsHeaders);
        return withCors(await handleRegister(request, env), corsHeaders);
      }

      // Wave 4: Logout endpoint
      if (pathname === '/api/logout' && method === 'POST') {
        return withCors(await handleLogout(request, env), corsHeaders);
      }

      if (pathname === '/api/auth/google' && method === 'GET') {
        return withCors(await handleGoogleAuth(request, env), corsHeaders);
      }

      if (pathname === '/api/auth/google/callback' && method === 'GET') {
        return withCors(await handleGoogleCallback(request, env), corsHeaders);
      }

      // Contact form route
      if (pathname === '/api/contact' && method === 'POST') {
        return withCors(await handleContactForm(request, env), corsHeaders);
      }

      if (pathname === '/api/stripe/create-checkout' && method === 'POST') {
        return withCors(await createCheckoutSession(request, env), corsHeaders);
      }

      if (pathname === '/api/stripe/webhook' && method === 'POST') {
        return withCors(await handleStripeWebhook(request, env), corsHeaders);
      }

      // Storage routes (admin only)
      if (pathname === '/api/storage' && method === 'GET') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await getStorage(request, env), corsHeaders);
      }

      if (pathname === '/api/storage/delete' && method === 'DELETE') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await deleteStorageFile(request, env), corsHeaders);
      }

      if (pathname === '/api/storage' && method === 'DELETE') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await deleteStorageFolder(request, env), corsHeaders);
      }

      if (pathname === '/api/setup-storage' && method === 'POST') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await setupStorage(request, env), corsHeaders);
      }

      if (pathname === '/api/upload' && method === 'POST') {
        const admin = await requireAdmin(request);
        if (!admin.ok) return withCors(admin.response, corsHeaders);
        return withCors(await handleUpload(request, env), corsHeaders);
      }

      // --- COMPATIBILITY ROUTES (for frontend with VITE_API_URL=root) ---
      if (pathname === '/login' && method === 'POST') {
        console.log('[WORKER] Compatibility: Handling /login as /api/login');
        const rateLimit = rateLimitMiddleware(request, loginLimiter);
        if (rateLimit) return withCors(rateLimit, corsHeaders);
        return withCors(await handleLogin(request, env), corsHeaders);
      }

      if (pathname === '/login' && method === 'GET') {
        return new Response(JSON.stringify({
          message: 'Login endpoint active (compatibility mode)',
          status: 'ok'
        }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      if (pathname === '/register' && method === 'POST') {
        console.log('[WORKER] Compatibility: Handling /register as /api/register');
        const rateLimit = rateLimitMiddleware(request, registerLimiter);
        if (rateLimit) return withCors(rateLimit, corsHeaders);
        return withCors(await handleRegister(request, env), corsHeaders);
      }
      // ------------------------------------------------------------------

      console.warn(`[404] Route not found: ${pathname}`);
      const notFoundResponse = new Response(JSON.stringify({
        error: 'Endpoint not found',
        path: pathname,
        help: 'Check /api for available endpoints'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
      // Wave 4: Apply security headers
      return shouldApplySecurityHeaders(notFoundResponse)
        ? addSecurityHeaders(notFoundResponse)
        : notFoundResponse;

    } catch (error: any) {
      console.error('[500] Worker error:', error);
      const errorResponse = new Response(JSON.stringify({
        error: 'Internal Server Error',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
      // Wave 4: Apply security headers
      return shouldApplySecurityHeaders(errorResponse)
        ? addSecurityHeaders(errorResponse)
        : errorResponse;
    }
  },
};
