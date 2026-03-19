import { api } from './api';

/**
 * Wave 4: Auth via HttpOnly cookies
 * Token is sent automatically via cookies (credentials: 'include')
 * No need to read from localStorage or set Authorization header
 */
export const authFetch = (path: string, init: RequestInit = {}) => {
  const url = path.startsWith('http://') || path.startsWith('https://') ? path : api(path);

  return fetch(url, {
    ...init,
    headers: init.headers,
    credentials: 'include', // Wave 4: Cookies sent automatically
  });
};
