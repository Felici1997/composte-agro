import { getAdminClient } from './admin'

export async function getAdminStats() {
  const admin = getAdminClient()
  const [products, services, users, orders, feedback] = await Promise.all([
    admin.from('products').select('*', { count: 'exact', head: true }),
    admin.from('services').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('*', { count: 'exact', head: true }),
    admin.from('feedback').select('*', { count: 'exact', head: true }),
  ])
  return {
    productsCount: products.count || 0,
    servicesCount: services.count || 0,
    usersCount: users.count || 0,
    ordersCount: orders.count || 0,
    feedbackCount: feedback.count || 0,
  }
}

export async function getProducts({ page = 1, perPage = 20, categoryId, statut, departement } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('products').select('*, profiles!products_vendeur_id_fkey(nom_complet, email, telephone)', { count: 'exact' })

  if (categoryId) query = query.eq('category_id', categoryId)
  if (statut !== undefined && statut !== '') query = query.eq('is_active', statut === 'actif')
  if (departement) query = query.eq('departement', departement)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getProductById(id) {
  const admin = getAdminClient()
  const { data, error } = await admin.from('products').select('*, profiles!products_vendeur_id_fkey(nom_complet, email, telephone)').eq('id', id).single()
  if (error) throw error
  return data
}

export async function upsertProduct(data, id = null) {
  const admin = getAdminClient()
  if (id) {
    const { error } = await admin.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await admin.from('products').insert({ ...data, updated_at: new Date().toISOString() })
    if (error) throw error
  }
}

export async function deleteProduct(id) {
  const admin = getAdminClient()
  const { error } = await admin.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function getServices({ page = 1, perPage = 20, departement } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('services').select('*, profiles!services_prestataire_id_fkey(nom_complet, email)', { count: 'exact' })
  if (departement) query = query.eq('departement', departement)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getServiceById(id) {
  const admin = getAdminClient()
  const { data, error } = await admin.from('services').select('*, profiles!services_prestataire_id_fkey(nom_complet, email)').eq('id', id).single()
  if (error) throw error
  return data
}

export async function upsertService(data, id = null) {
  const admin = getAdminClient()
  const payload = { ...data, updated_at: new Date().toISOString() }
  if (id) {
    const { error } = await admin.from('services').update(payload).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await admin.from('services').insert(payload)
    if (error) throw error
  }
}

export async function deleteService(id) {
  const admin = getAdminClient()
  const { error } = await admin.from('services').delete().eq('id', id)
  if (error) throw error
}

export async function getUsers({ page = 1, perPage = 20, role, search } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('profiles').select('*', { count: 'exact' })
  if (role) query = query.eq('role', role)
  if (search) {
    const safe = search.replace(/[%_\\]/g, '\\$&')
    query = query.or(`nom_complet.ilike.%${safe}%,email.ilike.%${safe}%`)
  }

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getUserById(id) {
  const admin = getAdminClient()
  const { data, error } = await admin.from('profiles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function updateUserProfile(id, updates) {
  const admin = getAdminClient()
  const { error } = await admin.from('profiles').update(updates).eq('id', id)
  if (error) throw error
}

export async function getOrders({ page = 1, perPage = 20, status, departement } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('orders').select('*, profiles!orders_buyer_id_fkey(nom_complet, email), vendeur:profiles!orders_vendeur_id_fkey(nom_complet)', { count: 'exact' })
  if (status) query = query.eq('status', status)
  if (departement) query = query.eq('departement', departement)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getOrderById(id) {
  const admin = getAdminClient()
  const { data, error } = await admin.from('orders').select('*, profiles!orders_buyer_id_fkey(nom_complet, email, telephone), vendeur:profiles!orders_vendeur_id_fkey(nom_complet), order_items(*, product:products(nom, image_url), service:services(titre))').eq('id', id).single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const admin = getAdminClient()
  const { error } = await admin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function getConversations({ page = 1, perPage = 20, status } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('conversations_with_profile').select('*', { count: 'exact' })
  if (status) query = query.eq('status', status)

  const { data, error, count } = await query.order('last_message_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getConversationMessages(conversationId) {
  const admin = getAdminClient()
  const { data, error } = await admin.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function sendAdminMessage(conversationId, senderId, content) {
  const admin = getAdminClient()
  const { error: msgError } = await admin.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    sender_role: 'assistant',
    content,
  })
  if (msgError) throw msgError

  await admin.from('conversations').update({
    last_message: content,
    last_message_at: new Date().toISOString(),
  }).eq('id', conversationId)
}

export async function closeConversation(conversationId) {
  const admin = getAdminClient()
  const { error } = await admin.from('conversations').update({ status: 'closed' }).eq('id', conversationId)
  if (error) throw error
}

export async function getFeedback({ page = 1, perPage = 20, type, status } = {}) {
  const admin = getAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = admin.from('feedback').select('*, profiles!feedback_user_id_fkey(nom_complet, email)', { count: 'exact' })
  if (type) query = query.eq('type', type)
  if (status) query = query.eq('status', status)

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function markFeedbackTreated(id) {
  const admin = getAdminClient()
  const { error } = await admin.from('feedback').update({ status: 'traite' }).eq('id', id)
  if (error) throw error
}
