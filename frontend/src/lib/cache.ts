// frontend/lib/cache.ts
const LOCAL_CACHE_PREFIX = "cocreate-";
const CACHE_EXPIRATION_TIME = 86400000; // 1 day in milliseconds

export function cacheContent(content: string, optimized: string) {
  if (typeof window !== "undefined") {
    const key = generateCacheKey(content);
    localStorage.setItem(
      key,
      JSON.stringify({
        optimized,
        timestamp: Date.now(),
      })
    );
  }
}

export function getCachedContent(content: string): string | null {
  if (typeof window !== "undefined") {
    const key = generateCacheKey(content);
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const { optimized, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
          return optimized;
        } else {
          localStorage.removeItem(key); // Clear expired cache
        }
      } catch (error) {
        console.error("Error parsing cache: ", error);
        localStorage.removeItem(key); // Remove corrupted cache
      }
    }
  }
  return null;
}

function generateCacheKey(content: string): string {
  return LOCAL_CACHE_PREFIX + hash(content);
}

function hash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
