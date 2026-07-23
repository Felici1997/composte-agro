import { getRedis } from './redis'

const DEFAULT_TTL = 300
const memoryStore = new Map()

const CACHE_PREFIXES = {
  allAds: 'ads:all',
  products: 'ads:products',
  listings: 'ads:listings',
  services: 'ads:services',
  adById: 'ads:byId:',
  categories: 'cats:all',
  profile: 'profile:',
  userListings: 'user:listings:',
  userProducts: 'user:products:',
  userServices: 'user:services:',
  listingsByCat: 'ads:listingsByCat:',
}

export function getPrefixes() {
  return CACHE_PREFIXES
}

export async function cached(key, fn, ttlMs = DEFAULT_TTL * 1000) {
  const redis = getRedis()

  if (redis) {
    try {
      const raw = await redis.get(key)
      if (raw !== null) return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {}

    const data = await fn()

    try {
      await redis.set(key, JSON.stringify(data), { ex: Math.ceil(ttlMs / 1000) })
    } catch {}

    return data
  }

  const entry = memoryStore.get(key)
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.data
  }

  const promise = fn().then(data => {
    memoryStore.set(key, { data, timestamp: Date.now() })
    return data
  }).catch(err => {
    memoryStore.delete(key)
    throw err
  })
  memoryStore.set(key, { data: promise, timestamp: Date.now() })
  return promise
}

export async function clearCache(key) {
  const redis = getRedis()
  if (redis) {
    try { await redis.del(key) } catch {}
  } else {
    if (key) memoryStore.delete(key)
    else memoryStore.clear()
  }
}

export async function clearCacheByPrefix(prefix) {
  const redis = getRedis()
  if (redis) {
    try {
      let cursor = 0
      do {
        const { cursor: nextCursor, keys } = await redis.scan(cursor, { match: `${prefix}*`, count: 50 })
        if (keys.length > 0) await redis.del(...keys)
        cursor = nextCursor
      } while (cursor !== 0)
    } catch {}
  } else {
    for (const k of memoryStore.keys()) {
      if (k.startsWith(prefix)) memoryStore.delete(k)
    }
  }
}

export function cacheKey(...parts) {
  return parts.filter(Boolean).join(':')
}
