// frontend/lib/cache.ts
const LOCAL_CACHE_PREFIX = "cocreate-";

export function cacheContent(content: string, optimized: string) {
  if (typeof window !== "undefined") {
    const key = LOCAL_CACHE_PREFIX + hash(content);
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
    const key = LOCAL_CACHE_PREFIX + hash(content);
    const cached = localStorage.getItem(key);
    if (cached) {
      const { optimized, timestamp } = JSON.parse(cached);
      // 1 day local cache
      if (Date.now() - timestamp < 86400000) {
        return optimized;
      }
    }
  }
  return null;
}

function hash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
