/**
 * tokenUtils.ts — Utilitários de token JWT com assinatura HMAC-SHA256
 * Substitui o btoa() sem assinatura que era vulnerável a adulteração.
 */

const TOKEN_SECRET = process.env.JWT_SECRET || 'eidos-hub-secret-2026-change-in-prod';

if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET não configurado! Usando fallback inseguro.');
}

// Encode base64url (sem padding)
function base64url(data: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(data)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlStr(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Gera um token JWT assinado com HMAC-SHA256
 */
export async function signToken(payload: Record<string, unknown>): Promise<string> {
    const header = base64urlStr(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64urlStr(JSON.stringify(payload));
    const signingInput = `${header}.${body}`;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(TOKEN_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
    return `${signingInput}.${base64url(signature)}`;
}

/**
 * Verifica e decodifica um token JWT. Retorna o payload ou null se inválido/expirado.
 */
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [header, body, signature] = parts;
        const signingInput = `${header}.${body}`;

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(TOKEN_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        // Decodifica signature base64url → ArrayBuffer
        const sigBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(signingInput));
        if (!valid) return null;

        const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));

        // Verifica expiração
        if (payload.exp && payload.exp < Date.now()) return null;

        return payload;
    } catch {
        return null;
    }
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
    if (!cookieHeader) return null;
    const parts = cookieHeader.split(';').map(v => v.trim());
    for (const part of parts) {
        const [k, ...rest] = part.split('=');
        if (k === name) return decodeURIComponent(rest.join('='));
    }
    return null;
}

/**
 * Extrai e valida o token do header Authorization: Bearer <token>
 * ou do cookie HttpOnly eidos_token.
 */
export async function getTokenPayload(request: Request): Promise<Record<string, unknown> | null> {
    const auth = request.headers.get('Authorization');
    if (auth?.startsWith('Bearer ')) {
        const payload = await verifyToken(auth.slice(7));
        if (payload) return payload;
    }

    const cookieToken = getCookieValue(request.headers.get('Cookie'), 'eidos_token');
    if (!cookieToken) return null;
    return verifyToken(cookieToken);
}

/**
 * Retorna resposta 401 padronizada
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
    return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
}
