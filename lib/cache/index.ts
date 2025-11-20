import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

interface CacheEntry { data: any; expires: number }
const cache = new Map<string, CacheEntry>();

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number): Promise<T> {
  if (redis) {
    const cached = await redis.get<string>(key);
    if (cached) {
      try { return JSON.parse(cached) as T } catch { return cached as unknown as T }
    }
    const fresh = await fetcher();
    await redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds });
    return fresh;
  }

  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }
  const fresh = await fetcher();
  cache.set(key, { data: fresh, expires: Date.now() + ttlSeconds * 1000 });
  return fresh;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expires < now) cache.delete(key);
  }
}, 60000);
