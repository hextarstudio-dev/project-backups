const rawApiBase = (import.meta.env.VITE_API_URL || 'https://api.eidostudio.com.br').replace(
  /\/+$/,
  ''
);

export const API_BASE = rawApiBase.endsWith('/api') ? rawApiBase.slice(0, -4) : rawApiBase;
export const API_URL = `${API_BASE}/api`;

export const api = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
};
