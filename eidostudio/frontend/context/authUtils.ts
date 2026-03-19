/**
 * authUtils.ts
 * Utilitários centralizados de autenticação para o Eidos Hub.
 */

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  exp: number; // timestamp em ms (Date.now() + duração)
}

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
  [key: string]: unknown;
}

/**
 * Mantido por compatibilidade (não usado no fluxo principal com cookie HttpOnly).
 */
export function decodeToken(token: string): TokenPayload | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    if (typeof payload.exp === 'number' && typeof payload.id === 'string') {
      return payload as TokenPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verifica se o token armazenado no localStorage está expirado.
 * Retorna true se expirado OU se o token não existir/for inválido.
 */
export function isTokenExpired(): boolean {
  const expRaw = localStorage.getItem('eidos_auth_exp');
  if (!expRaw) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp)) return false;
  return Date.now() >= exp;
}

/**
 * Faz merge parcial dos dados do usuário no localStorage.
 * Garante que campos não enviados não sejam sobrescritos.
 *
 * @example
 * syncUserToStorage({ name: 'Novo Nome' }); // só atualiza o nome
 * syncUserToStorage({ avatarUrl: null });    // limpa só o avatar
 */
export function syncUserToStorage(updates: Partial<StoredUser>): void {
  try {
    const raw = localStorage.getItem('eidos_user');
    const existing: StoredUser = raw ? JSON.parse(raw) : {};
    const merged = { ...existing, ...updates };
    localStorage.setItem('eidos_user', JSON.stringify(merged));
  } catch (e) {
    console.error('[authUtils] Falha ao sincronizar usuário no localStorage:', e);
  }
}

/**
 * Lê e retorna os dados do usuário armazenados no localStorage.
 * Retorna null se não houver dados.
 */
export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('eidos_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Limpa todos os dados de sessão do localStorage.
 */
export function clearAuthStorage(): void {
  localStorage.removeItem('eidos_auth');
  localStorage.removeItem('eidos_user');
  localStorage.removeItem('eidos_auth_exp');
  localStorage.removeItem('eidos_token');
}
