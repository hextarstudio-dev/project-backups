/**
 * Wave 3 - Simple Query Cache
 * In-memory cache with TTL for query results
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export class SimpleCache {
    private cache = new Map<string, CacheEntry<any>>();
    private defaultTTL: number;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(defaultTTL: number = 60000) {  // Default: 1 minute
        this.defaultTTL = defaultTTL;
        this.startCleanup();
    }

    /**
     * Get value from cache
     * @param key Cache key
     * @returns Cached value or null if expired/not found
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set value in cache
     * @param key Cache key
     * @param data Data to cache
     * @param ttl Optional custom TTL in milliseconds
     */
    set<T>(key: string, data: T, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL
        });
    }

    /**
     * Invalidate cache entries
     * @param pattern Optional pattern to match keys (e.g., 'products:')
     */
    invalidate(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        const keysToDelete: string[] = [];
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                keysToDelete.push(key);
            }
        }

        for (const key of keysToDelete) {
            this.cache.delete(key);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Start automatic cleanup of expired entries
     */
    private startCleanup(): void {
        // Clean up every minute
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            let cleaned = 0;

            for (const [key, entry] of this.cache.entries()) {
                if (now - entry.timestamp > entry.ttl) {
                    this.cache.delete(key);
                    cleaned++;
                }
            }

            if (cleaned > 0) {
                console.log(`[Cache] Cleaned ${cleaned} expired entries`);
            }
        }, 60000); // Run every minute
    }

    /**
     * Stop cleanup interval (useful for testing or graceful shutdown)
     */
    stopCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

// Global cache instance with 60 second TTL
export const queryCache = new SimpleCache(60000);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Cache] Stopping cleanup on SIGTERM');
    queryCache.stopCleanup();
});
