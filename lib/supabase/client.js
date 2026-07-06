import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client = null

function createClient() {
  if (!url || !key || url.includes('placeholder')) {
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase non configuré') }),
        signUp: async () => ({ data: null, error: new Error('Supabase non configuré') }),
        signOut: async () => {},
      },
    }
  }
  return createBrowserClient(url, key)
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    if (!client) client = createClient()
    return client[prop]
  }
})
