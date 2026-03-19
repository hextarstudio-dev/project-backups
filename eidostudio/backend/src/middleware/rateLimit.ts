/**
 * Wave 4 - Rate Limiting Middleware
 * Protects against brute force and DoS attacks
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup expired entries every minute
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
          cleaned++;
        }
      }
      if (cleaned > 0) {
        console.log(`[RateLimit] Cleaned ${cleaned} expired entries`);
      }
    }, 60000);
  }

  /**
   * Check if request should be rate limited
   * @param identifier Unique identifier (IP, user ID, etc.)
   * @returns null if allowed, Response if rate limited
   */
  check(identifier: string): Response | null {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return null;
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(this.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(entry.resetTime),
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Increment counter
    entry.count++;
    return null;
  }

  /**
   * Reset rate limit for an identifier (e.g., after successful login)
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Wave 4: Global rate limiters
export const loginLimiter = new RateLimiter(5, 60000); // 5 requests per minute
export const registerLimiter = new RateLimiter(3, 60000); // 3 requests per minute
export const apiLimiter = new RateLimiter(100, 60000); // 100 requests per minute

/**
 * Extract client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const headers = request.headers;

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  // Fallback to 'unknown'
  return 'unknown';
}

/**
 * Apply rate limiting middleware
 */
export function rateLimitMiddleware(
  request: Request,
  limiter: RateLimiter
): Response | null {
  const identifier = getClientIP(request);
  return limiter.check(identifier);
}
