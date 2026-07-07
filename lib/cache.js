const store = new Map()

export function cached(key, fn, ttlMs = 60000) {
  const entry = store.get(key)
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.data
  }
  const promise = fn().then(data => {
    store.set(key, { data, timestamp: Date.now() })
    return data
  }).catch(err => {
    store.delete(key)
    throw err
  })
  store.set(key, { data: promise, timestamp: Date.now() })
  return promise
}

export function clearCache(key) {
  if (key) store.delete(key)
  else store.clear()
}
