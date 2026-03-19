import { Env } from './db';
import { getStorage, deleteStorageFile, setupStorage } from './storageHandlers';
import { getTokenPayload, unauthorizedResponse } from './tokenUtils';

const BRAND_AVATAR_URL = 'https://cdn.eidostudio.com.br/assets/logos/isotipo-preto-2.svg';

async function ensureLessonProgressTable(env: Env) {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS hub_user_lesson_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL REFERENCES hub_products(id) ON DELETE CASCADE,
        lesson_id TEXT NOT NULL,
        completed BOOLEAN DEFAULT TRUE,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, lesson_id)
      )
    `).run();
}


// --- HELPER: Ensure R2 Folder ---
// Reuses the logic from storagehandlers or implements a simple version
async function ensureR2Folder(env: Env, key: string) {
    if (!key) return;
    try {
        const objectKey = key.endsWith('/') ? key : `${key}/`;
        await env.R2.put(objectKey, '');
    } catch (err: any) {
        console.warn('[R2] Failed to create folder:', key, err.message || err);
    }
}

// --- HUB PRODUCTS ---
export async function getHubProducts(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const requestedUserId = url.searchParams.get('userId');

        let userId: string | null = null;
        if (requestedUserId) {
            const tokenPayload = await getTokenPayload(request);
            if (!tokenPayload) return unauthorizedResponse();
            if (tokenPayload.id !== requestedUserId && tokenPayload.role !== 'admin') {
                return unauthorizedResponse('Forbidden - User ID mismatch');
            }
            userId = requestedUserId;
        }

        await ensureLessonProgressTable(env);

        let purchasedIds = new Set<string>();
        const progressByProduct: Record<string, number> = {};
        if (userId) {
            const purchased = await env.DB.prepare('SELECT product_id FROM hub_user_products WHERE user_id = ?').bind(userId).all();
            if (purchased.results) {
                purchased.results.forEach((r: any) => {
                    purchasedIds.add(r.product_id);
                    // Lógica de Bundle/Pacotes: Se ele tem o Eidos Pack, libera automaticamente todos os 7 módulos internos + o Bônus
                    if (r.product_id === 'eidos-pack' || r.product_id === 'prod_TxLHC5q9ckSUwI') {
                        ['prod_U27zA9t065wJaY','prod_TxLD49GFquB1S2','prod_TxLDxEYMFwGotV','prod_TxLDri3sdXAp0H','prod_TxLDL5oTDUNGTh','prod_TxLDcjRlurXW1c','prod_TxLDaQYotWdv1v','prod_TxLD3ntDcA5JZO'].forEach(id => purchasedIds.add(id));
                    }
                });
            }
        }

        if (userId) {
            const progressRows = await env.DB.prepare('SELECT product_id, lesson_id FROM hub_user_lesson_progress WHERE user_id = ? AND completed = TRUE').bind(userId).all();
            (progressRows.results || []).forEach((r: any) => {
                if (!progressByProduct[r.product_id]) progressByProduct[r.product_id] = 0;
                progressByProduct[r.product_id] += 1;
            });
        }

        // Wave 3: Fix N+1 query - JOIN com json_agg para reduzir de 51 queries para 1 query
        const productsWithLessons = await env.DB.prepare(`
            SELECT
                hp.id, hp.title, hp.category, hp.image_url,
                hp.author, hp.duration_label, hp.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', hl.id,
                            'title', hl.title,
                            'type', hl.type,
                            'duration', hl.duration,
                            'url', hl.url,
                            'description', hl.description
                        ) ORDER BY hl."order" ASC
                    ) FILTER (WHERE hl.id IS NOT NULL),
                    '[]'::json
                ) as lessons
            FROM hub_products hp
            LEFT JOIN hub_lessons hl ON hl.product_id = hp.id
            GROUP BY hp.id, hp.title, hp.category, hp.image_url, hp.author, hp.duration_label, hp.created_at
            ORDER BY hp.created_at DESC
        `).all();

        // Cloudflare D1 returns results in .results property
        const hiddenBonusIds = new Set(['prod_TxLDaQYotWdv1v', 'prod_TxLD3ntDcA5JZO']);
        const productsList = (productsWithLessons.results || []).filter((p: any) => !hiddenBonusIds.has(p.id));

        const payload = productsList.map((product: any) => {
            // Parse lessons JSON (PostgreSQL returns it as JSON string or object)
            let lessons = [];
            if (typeof product.lessons === 'string') {
                try {
                    lessons = JSON.parse(product.lessons);
                } catch (e) {
                    lessons = [];
                }
            } else if (Array.isArray(product.lessons)) {
                lessons = product.lessons;
            }

            return {
                id: product.id,
                title: product.title,
                category: product.category,
                image: product.image_url,
                progress: (() => {
                    if (!purchasedIds.has(product.id)) return 0;
                    const total = lessons.length;
                    if (!total) return 0;
                    const done = progressByProduct[product.id] || 0;
                    return Math.max(0, Math.min(1, done / total));
                })(),
                owned: purchasedIds.has(product.id),
                author: product.author,
                duration: product.duration_label,
                lessons: lessons
            };
        });

        return new Response(JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error: any) {
        console.error('[HUB] Load error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function markHubLessonProgress(request: Request, env: Env): Promise<Response> {
    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();

    try {
        await ensureLessonProgressTable(env);
        const body = await request.json() as { userId: string; productId: string; lessonId: string; completed?: boolean };
        if (!body?.userId || !body?.productId || !body?.lessonId) {
            return new Response(JSON.stringify({ error: 'userId, productId, lessonId required' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        if (tokenPayload.id !== body.userId && tokenPayload.role !== 'admin') {
            return unauthorizedResponse('Forbidden - User ID mismatch');
        }

        const completed = body.completed !== false;

        if (completed) {
            await env.DB.prepare(`
                INSERT INTO hub_user_lesson_progress (id, user_id, product_id, lesson_id, completed)
                VALUES (?, ?, ?, ?, TRUE)
                ON CONFLICT (user_id, product_id, lesson_id)
                DO UPDATE SET completed = EXCLUDED.completed, completed_at = CURRENT_TIMESTAMP
            `).bind(
                `hlp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                body.userId,
                body.productId,
                body.lessonId
            ).run();
        } else {
            await env.DB.prepare('DELETE FROM hub_user_lesson_progress WHERE user_id = ? AND product_id = ? AND lesson_id = ?')
                .bind(body.userId, body.productId, body.lessonId).run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
}

// --- HUB USERS ---
export async function getHubUser(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // Extract ID from path. Assuming path is /api/hub/users/:id
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    if (!id) {
        return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });
    }

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== id && tokenPayload.role !== 'admin') {
        return unauthorizedResponse('Forbidden - User ID mismatch');
    }

    try {
        const user = await env.DB.prepare('SELECT id, name, email FROM users WHERE id = ?').bind(id).first();

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        let hubUser = await env.DB.prepare('SELECT * FROM hub_users WHERE user_id = ?').bind(id).first();

        if (!hubUser) {
            await env.DB.prepare(`
        INSERT INTO hub_users (user_id, name, email, avatar_url)
        VALUES (?, ?, ?, ?)
      `).bind(id, user.name, user.email, BRAND_AVATAR_URL).run();

            hubUser = await env.DB.prepare('SELECT * FROM hub_users WHERE user_id = ?').bind(id).first();
        }

        await ensureR2Folder(env, `eidoshub/users/${id}/`);

        return new Response(JSON.stringify({
            id: user.id,
            name: hubUser?.name || user.name,
            email: hubUser?.email || user.email,
            phone: hubUser?.phone || null,
            company: hubUser?.company || null,
            role: hubUser?.role || null,
            avatarUrl: hubUser?.avatar_url || null,
            avatarKey: hubUser?.avatar_key || null
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error: any) {
        console.error('[HUB] User load error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function getHubUserPurchases(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    // Expected path: /api/hub/users/:id/purchases
    // Index will depend if there's trailing slash, but typically:
    // parts = ["", "api", "hub", "users", "user-id", "purchases"]
    const id = parts[parts.length - 2];

    if (!id) {
        return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });
    }

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== id && tokenPayload.role !== 'admin') {
        return unauthorizedResponse('Forbidden - User ID mismatch');
    }

    try {
        // Obter os produtos comprados pelo usuário juntando hub_user_products e hub_products
        const purchasesResult = await env.DB.prepare(`
            SELECT 
                hup.id as purchase_id,
                hup.created_at as purchased_at,
                hup.amount_paid,
                hp.title as product_title
            FROM hub_user_products hup
            JOIN hub_products hp ON hup.product_id = hp.id
            WHERE hup.user_id = ?
            ORDER BY hup.created_at DESC
        `).bind(id).all();

        const purchases = purchasesResult.results || [];

        return new Response(JSON.stringify(purchases), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error: any) {
        console.error('[HUB] Purchases load error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function updateHubUser(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    if (!id) return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== id && tokenPayload.role !== 'admin') {
        return unauthorizedResponse('Forbidden - User ID mismatch');
    }

    const payload: any = await request.json();

    try {
        const user = await env.DB.prepare('SELECT id, name, email FROM users WHERE id = ?').bind(id).first();
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const existingHub: any = await env.DB.prepare('SELECT * FROM hub_users WHERE user_id = ?').bind(id).first() || {};

        const hasAvatarKey = Object.prototype.hasOwnProperty.call(payload, 'avatarKey');
        const hasAvatarUrl = Object.prototype.hasOwnProperty.call(payload, 'avatarUrl');

        const nextName = payload.name ?? existingHub.name ?? user.name;
        const nextEmail = payload.email ?? existingHub.email ?? user.email;
        const nextPhone = payload.phone ?? existingHub.phone ?? null;
        const nextCompany = payload.company ?? existingHub.company ?? null;
        const nextRole = payload.role ?? existingHub.role ?? null;
        const nextAvatarKey = hasAvatarKey ? (payload.avatarKey || null) : (existingHub.avatar_key || null);
        const nextAvatarUrl = hasAvatarUrl ? (payload.avatarUrl || null) : (existingHub.avatar_url || null);

        // D1 Batch Execution
        await env.DB.batch([
            env.DB.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').bind(nextName, nextEmail, id),
            env.DB.prepare(`
        INSERT INTO hub_users (user_id, name, email, phone, company, role, avatar_url, avatar_key, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
            name = excluded.name,
            email = excluded.email,
            phone = excluded.phone,
            company = excluded.company,
            role = excluded.role,
            avatar_url = excluded.avatar_url,
            avatar_key = excluded.avatar_key,
            updated_at = CURRENT_TIMESTAMP
      `).bind(id, nextName, nextEmail, nextPhone, nextCompany, nextRole, nextAvatarUrl, nextAvatarKey)
        ]);

        if (existingHub.avatar_key && existingHub.avatar_key !== nextAvatarKey) {
            try {
                await env.R2.delete(existingHub.avatar_key);
            } catch (e) {
                console.warn("Failed to delete old avatar", e);
            }
        }

        return new Response(JSON.stringify({
            id,
            name: nextName,
            email: nextEmail,
            phone: nextPhone,
            company: nextCompany,
            role: nextRole,
            avatarUrl: nextAvatarUrl,
            avatarKey: nextAvatarKey
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error: any) {
        console.error('[HUB] User update error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function deleteHubUserAvatar(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url); // /api/hub/users/:id/avatar
    const parts = url.pathname.split('/');
    // Assuming path split: ["", "api", "hub", "users", "ID", "avatar"]
    // parts[4] should be ID
    const id = parts[4];

    if (!id) return new Response(JSON.stringify({ error: 'Invalid URL structure' }), { status: 400 });

    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();
    if (tokenPayload.id !== id && tokenPayload.role !== 'admin') {
        return unauthorizedResponse('Forbidden - User ID mismatch');
    }

    try {
        const existingHub: any = await env.DB.prepare('SELECT avatar_key FROM hub_users WHERE user_id = ?').bind(id).first();

        if (existingHub?.avatar_key) {
            try {
                await env.R2.delete(existingHub.avatar_key);
            } catch (e) { console.warn("Delete avatar failed", e) }
        }

        await env.DB.prepare(`
      UPDATE hub_users
      SET avatar_url = NULL, avatar_key = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(id).run();

        return new Response(JSON.stringify({ id, avatarUrl: null, avatarKey: null }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error: any) {
        console.error('[HUB] Avatar delete error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function getHubLessonComments(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const lessonId = parts[parts.length - 1]; // /api/hub/comments/:lessonId

        if (!lessonId) {
            return new Response(JSON.stringify({ error: 'Lesson ID is required' }), {
                status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const tokenPayload = await getTokenPayload(request);
        if (!tokenPayload) return unauthorizedResponse();

        const { results } = await env.DB.prepare(`
      SELECT c.id, c.lesson_id, c.user_id, c.content, c.created_at, 
             u.name, hu.avatar_url
      FROM hub_comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN hub_users hu ON hu.user_id = u.id
      WHERE c.lesson_id = ?
      ORDER BY c.created_at ASC
    `).bind(lessonId).all();

        return new Response(JSON.stringify(results || []), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error: any) {
        console.error('Fetch comments error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch comments', details: error.message }), {
            status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function postHubLessonComment(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const lessonId = parts[parts.length - 1];

        if (!lessonId) {
            return new Response(JSON.stringify({ error: 'Lesson ID is required' }), {
                status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const body = await request.json() as { userId: string, content: string };
        const { userId, content } = body;

        if (!userId || !content) {
            return new Response(JSON.stringify({ error: 'User ID and content are required' }), {
                status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const tokenPayload = await getTokenPayload(request);
        if (!tokenPayload) return unauthorizedResponse();
        if (tokenPayload.id !== userId && tokenPayload.role !== 'admin') return unauthorizedResponse('Forbidden');

        const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        await env.DB.prepare(`
      INSERT INTO hub_comments (id, lesson_id, user_id, content) 
      VALUES (?, ?, ?, ?)
    `).bind(commentId, lessonId, userId, content).run();

        return new Response(JSON.stringify({ success: true, id: commentId }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error: any) {
        console.error('Post comment error:', error);
        return new Response(JSON.stringify({ error: 'Failed to post comment', details: error.message }), {
            status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function deleteHubLessonComment(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/');

        // Expected: /api/hub/comments/:lessonId/:commentId
        const lessonId = parts[4];
        const commentId = parts[5];

        if (!lessonId || !commentId) {
            return new Response(JSON.stringify({ error: 'Lesson ID and Comment ID are required' }), {
                status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const body = await request.json() as { userId: string };
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const tokenPayload = await getTokenPayload(request);
        if (!tokenPayload) return unauthorizedResponse();
        if (tokenPayload.id !== userId && tokenPayload.role !== 'admin') return unauthorizedResponse('Forbidden');

        // Verify ownership and delete
        const result = await env.DB.prepare(`
            DELETE FROM hub_comments 
            WHERE id = ? AND lesson_id = ? AND user_id = ?
        `).bind(commentId, lessonId, userId).run();

        if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Comment not found or unauthorized' }), {
                status: 403, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'Comment deleted' }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error: any) {
        console.error('Delete comment error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete comment', details: error.message }), {
            status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
