import { Env } from './db';
import { getTokenPayload, unauthorizedResponse } from './tokenUtils';

// Response helper
const createResponse = (body: any, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    }
  });
};

export async function getHubNotifications(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/')[4]; // /api/hub/users/:id/notifications

    if (!userId) {
      return createResponse({ error: 'User ID is required' }, 400);
    }

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== userId && tokenPayload.role !== 'admin') return unauthorizedResponse('Forbidden');

    if (!env.DB) {
      throw new Error('Database connection not available');
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM hub_notifications WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all();

    return createResponse(results || []);
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Get error:', error);
    return createResponse({ error: 'Internal Server Error', details: error.message }, 500);
  }
}

export async function markNotificationRead(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const notificationId = url.pathname.split('/')[4]; // /api/hub/notifications/:id/read

    if (!notificationId) {
      return createResponse({ error: 'Notification ID is required' }, 400);
    }

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();

    if (!env.DB) {
      throw new Error('Database connection not available');
    }

    await env.DB.prepare(
      'UPDATE hub_notifications SET is_read = TRUE WHERE id = ? AND user_id = ?'
    ).bind(notificationId, tokenPayload.id).run();

    return createResponse({ success: true, id: notificationId });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Mark read error:', error);
    return createResponse({ error: 'Internal Server Error', details: error.message }, 500);
  }
}

export async function markAllNotificationsRead(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/')[4]; // /api/hub/users/:id/notifications/read-all

    if (!userId) {
      return createResponse({ error: 'User ID is required' }, 400);
    }

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== userId && tokenPayload.role !== 'admin') return unauthorizedResponse('Forbidden');

    if (!env.DB) {
      throw new Error('Database connection not available');
    }

    await env.DB.prepare(
      'UPDATE hub_notifications SET is_read = TRUE WHERE user_id = ?'
    ).bind(userId).run();

    return createResponse({ success: true, userId });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Mark all read error:', error);
    return createResponse({ error: 'Internal Server Error', details: error.message }, 500);
  }
}
