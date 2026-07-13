import { supabase, fetchWithTimeout } from './client'
import { getCategoryById } from '@/lib/categories'
import { cached, clearCache } from '@/lib/cache'

async function safeGetProfile(userId) {
  if (!userId) return null
  try {
    const { data } = await fetchWithTimeout(supabase.from('profiles').select('*').eq('id', userId).maybeSingle())
    return data || null
  } catch {
    return null
  }
}

async function enrichWithProfiles(items, getId) {
  const profiles = await Promise.allSettled(
    items.map(item => safeGetProfile(getId(item)))
  )
  return items.map((item, i) => ({
    ...item,
    _profile: profiles[i].status === 'fulfilled' ? profiles[i].value : null,
  }))
}

export async function fetchCategories() {
  try {
    const { data, error } = await fetchWithTimeout(supabase.from('categories').select('*').order('id', { ascending: true }))
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function fetchAllProducts() {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50)
    )
    if (error) { console.error('fetchAllProducts error:', error); return [] }
    const enriched = await enrichWithProfiles(data || [], p => p.vendeur_id)
    return enriched.map(p => ({ ...p, _key: `product_${p.id}`, contentType: 'product', _category: getCategoryById(p.category_id) }))
  } catch (e) {
    console.error('fetchAllProducts timeout/fail:', e)
    return []
  }
}

export async function fetchAllListings() {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase.from('listings').select('*').eq('status', 'disponible').order('created_at', { ascending: false }).limit(50)
    )
    if (error) { console.error('fetchAllListings error:', error); return [] }
    const enriched = await enrichWithProfiles(data || [], l => l.seller_id)
    return enriched.map(l => ({ ...l, _key: `listing_${l.id}`, contentType: 'listing', _category: getCategoryById(l.category_id) }))
  } catch (e) {
    console.error('fetchAllListings timeout/fail:', e)
    return []
  }
}

export async function fetchAllServices() {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase.from('services').select('*').eq('est_disponible', true).order('created_at', { ascending: false }).limit(50)
    )
    if (error) { console.error('fetchAllServices error:', error); return [] }
    const enriched = await enrichWithProfiles(data || [], s => s.prestataire_id)
    return enriched.map(s => ({ ...s, _key: `service_${s.id}`, contentType: 'service', _category: getCategoryById(43) }))
  } catch (e) {
    console.error('fetchAllServices timeout/fail:', e)
    return []
  }
}

export async function fetchAllAds() {
  const [products, listings, services] = await Promise.allSettled([
    fetchAllProducts(),
    fetchAllListings(),
    fetchAllServices(),
  ])
  return [
    ...(products.status === 'fulfilled' ? products.value : []),
    ...(listings.status === 'fulfilled' ? listings.value : []),
    ...(services.status === 'fulfilled' ? services.value : []),
  ]
}

export async function fetchAdById(id) {
  const strId = String(id)
  try {
    if (strId.startsWith('product_') || (!isNaN(Number(strId)) && strId.length < 20)) {
      const numId = parseInt(strId.replace('product_', ''))
      const { data, error } = await fetchWithTimeout(supabase.from('products').select('*').eq('id', numId).maybeSingle())
      if (!error && data) {
        const profile = await safeGetProfile(data.vendeur_id)
        return { ...data, _key: `product_${data.id}`, contentType: 'product', _profile: profile, _category: getCategoryById(data.category_id) }
      }
    }
    if (strId.startsWith('service_')) {
      const numId = parseInt(strId.replace('service_', ''))
      const { data, error } = await fetchWithTimeout(supabase.from('services').select('*').eq('id', numId).maybeSingle())
      if (!error && data) {
        const profile = await safeGetProfile(data.prestataire_id)
        return { ...data, _key: `service_${data.id}`, contentType: 'service', _profile: profile, _category: getCategoryById(43) }
      }
    }
    const { data, error } = await fetchWithTimeout(supabase.from('listings').select('*').eq('id', id).maybeSingle())
    if (!error && data) {
      const profile = await safeGetProfile(data.seller_id)
      return { ...data, _key: `listing_${data.id}`, contentType: 'listing', _profile: profile, _category: getCategoryById(data.category_id) }
    }
  } catch (e) {
    console.error('fetchAdById timeout/fail:', e)
  }
  return null
}

export async function fetchProfile(userId) {
  return safeGetProfile(userId)
}

export function clearQueriesCache() {
  clearCache()
}

export async function fetchListingsByCategoryIds(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) return []
  const key = `listingsByCat_${[...categoryIds].sort().join(',')}`
  return cached(key, async () => {
    try {
      const { data, error } = await fetchWithTimeout(
        supabase.from('listings').select('*').in('category_id', categoryIds).eq('status', 'disponible').order('created_at', { ascending: false }).limit(50)
      )
      if (error) { console.error('fetchListingsByCategoryIds error:', error); return [] }
      const enriched = await enrichWithProfiles(data || [], l => l.seller_id)
      return enriched.map(l => ({ ...l, _key: `listing_${l.id}`, contentType: 'listing', _category: getCategoryById(l.category_id) }))
    } catch (e) {
      console.error('fetchListingsByCategoryIds timeout/fail:', e)
      return []
    }
  })
}

export async function fetchUserListings(userId) {
  if (!userId) return []
  return cached(`userListings_${userId}`, async () => {
    try {
      const { data, error } = await fetchWithTimeout(
        supabase.from('listings').select('*').eq('seller_id', userId).order('created_at', { ascending: false }).limit(50)
      )
      if (error) { console.error('fetchUserListings error:', error); return [] }
      const enriched = await enrichWithProfiles(data || [], l => l.seller_id)
      return enriched.map(l => ({ ...l, _key: `listing_${l.id}`, contentType: 'listing', _category: getCategoryById(l.category_id) }))
    } catch (e) {
      console.error('fetchUserListings timeout/fail:', e)
      return []
    }
  })
}

export async function fetchUserProducts(userId) {
  if (!userId) return []
  return cached(`userProducts_${userId}`, async () => {
    try {
      const { data, error } = await fetchWithTimeout(
        supabase.from('products').select('*').eq('vendeur_id', userId).order('created_at', { ascending: false }).limit(50)
      )
      if (error) { console.error('fetchUserProducts error:', error); return [] }
      const enriched = await enrichWithProfiles(data || [], p => p.vendeur_id)
      return enriched.map(p => ({ ...p, _key: `product_${p.id}`, contentType: 'product', _category: getCategoryById(p.category_id) }))
    } catch (e) {
      console.error('fetchUserProducts timeout/fail:', e)
      return []
    }
  })
}

export async function fetchUserServices(userId) {
  if (!userId) return []
  return cached(`userServices_${userId}`, async () => {
    try {
      const { data, error } = await fetchWithTimeout(
        supabase.from('services').select('*').eq('prestataire_id', userId).order('created_at', { ascending: false }).limit(50)
      )
      if (error) { console.error('fetchUserServices error:', error); return [] }
      const enriched = await enrichWithProfiles(data || [], s => s.prestataire_id)
      return enriched.map(s => ({ ...s, _key: `service_${s.id}`, contentType: 'service', _category: getCategoryById(43) }))
    } catch (e) {
      console.error('fetchUserServices timeout/fail:', e)
      return []
    }
  })
}
