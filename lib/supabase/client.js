import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client = null

function createClient() {
  if (!url || !key || url.includes('placeholder')) {
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }),
        in: () => ({ order: () => ({ limit: async () => ({ data: [], error: null }) }) }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase non configuré') }),
        signUp: async () => ({ data: null, error: new Error('Supabase non configuré') }),
        signOut: async () => {},
        getUser: async () => ({ data: { user: null } }),
      },
    }
  }
  return createBrowserClient(url, key)
}

export function fetchWithTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
  ])
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    if (!client) client = createClient()
    return client[prop]
  }
})
