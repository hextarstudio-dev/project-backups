/**
 * Wave 4 - Security Headers Middleware
 * Adds essential security headers to all responses
 */

export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.eidostudio.com.br https://accounts.google.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://cdn.eidostudio.com.br https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com https://cdn.eidostudio.com.br",
      "connect-src 'self' https://api.eidostudio.com.br https://cdn.eidostudio.com.br https://accounts.google.com https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  );

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // XSS Protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // HTTPS Strict Transport Security (HSTS)
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (formerly Feature-Policy)
  headers.set(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()'
    ].join(', ')
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Helper to check if response should have security headers
 * Skip for certain content types (images, fonts, etc.)
 */
export function shouldApplySecurityHeaders(response: Response): boolean {
  const contentType = response.headers.get('content-type') || '';

  // Don't apply to binary content
  if (contentType.startsWith('image/')) return false;
  if (contentType.startsWith('font/')) return false;
  if (contentType.includes('octet-stream')) return false;

  return true;
}
