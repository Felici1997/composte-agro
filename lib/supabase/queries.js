import { supabase } from './client'
import { getCategoryById } from '@/lib/categories'

async function safeGetProfile(userId) {
  if (!userId) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  return data || null
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true })
  if (error) throw error
  return data || []
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) { console.error('fetchAllProducts error:', error); return [] }

  const results = []
  for (const p of (data || [])) {
    const profile = await safeGetProfile(p.vendeur_id)
    results.push({ ...p, _key: `product_${p.id}`, contentType: 'product', _profile: profile, _category: getCategoryById(p.category_id) })
  }
  return results
}

export async function fetchAllListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'disponible')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) { console.error('fetchAllListings error:', error); return [] }

  const results = []
  for (const l of (data || [])) {
    const profile = await safeGetProfile(l.seller_id)
    results.push({ ...l, _key: `listing_${l.id}`, contentType: 'listing', _profile: profile, _category: getCategoryById(l.category_id) })
  }
  return results
}

export async function fetchAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('est_disponible', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) { console.error('fetchAllServices error:', error); return [] }

  const results = []
  for (const s of (data || [])) {
    const profile = await safeGetProfile(s.prestataire_id)
    results.push({ ...s, _key: `service_${s.id}`, contentType: 'service', _profile: profile, _category: getCategoryById(43) })
  }
  return results
}

export async function fetchAllAds() {
  const [products, listings, services] = await Promise.all([
    fetchAllProducts().catch(() => []),
    fetchAllListings().catch(() => []),
    fetchAllServices().catch(() => []),
  ])
  return [...products, ...listings, ...services]
}

export async function fetchAdById(id) {
  const strId = String(id)
  if (strId.startsWith('product_') || !isNaN(Number(strId)) && strId.length < 20) {
    const numId = parseInt(strId.replace('product_', ''))
    const { data, error } = await supabase.from('products').select('*').eq('id', numId).maybeSingle()
    if (!error && data) {
      const profile = await safeGetProfile(data.vendeur_id)
      return { ...data, _key: `product_${data.id}`, contentType: 'product', _profile: profile, _category: getCategoryById(data.category_id) }
    }
  }
  if (strId.startsWith('service_')) {
    const numId = parseInt(strId.replace('service_', ''))
    const { data, error } = await supabase.from('services').select('*').eq('id', numId).maybeSingle()
    if (!error && data) {
      const profile = await safeGetProfile(data.prestataire_id)
      return { ...data, _key: `service_${data.id}`, contentType: 'service', _profile: profile, _category: getCategoryById(43) }
    }
  }
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).maybeSingle()
  if (!error && data) {
    const profile = await safeGetProfile(data.seller_id)
    return { ...data, _key: `listing_${data.id}`, contentType: 'listing', _profile: profile, _category: getCategoryById(data.category_id) }
  }
  return null
}

export async function fetchProfile(userId) {
  return safeGetProfile(userId)
}
