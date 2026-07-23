import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { invalidateAdsCache } from '@/lib/supabase/queries'

const VALID_DEPARTEMENTS = ['Brazzaville', 'Pointe-Noire', 'Pool', 'Bouenza', 'Lékoumou', 'Niari', 'Plateaux', 'Cuvette', 'Cuvette-Ouest', 'Sangha', 'Likouala']

const TABLE_MAP = { listing: 'listings', product: 'products', service: 'services' }
const OWNER_COL = { listings: 'client_id', products: 'vendeur_id', services: 'prestataire_id' }
const ACTIVE_COL = { listings: 'status', products: 'is_active', services: 'est_disponible' }

function getContentType(body) {
  const role = body._role || 'client'
  if (role === 'vendeur') return 'product'
  if (role === 'prestataire') return 'service'
  return 'listing'
}

async function getUserRole(supabase, userId) {
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  return profile?.role || 'client'
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const role = await getUserRole(supabase, user.id)
    const body = await request.json()
    const { title, description, price, unit, category_id, city, region, image_url, images, is_pre_sale, harvest_date, stock_actuel, type_service } = body
    const imagesJson = Array.isArray(images) && images.length > 0 ? images : null

    if (!title || title.length > 80) {
      return NextResponse.json({ error: 'Titre invalide (max 80 caractères)' }, { status: 400 })
    }
    if (!description || description.length > 2000) {
      return NextResponse.json({ error: 'Description invalide (max 2000 caractères)' }, { status: 400 })
    }
    const catId = parseInt(category_id)
    if (isNaN(catId) || catId <= 0) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }
    const priceNum = price ? parseFloat(price) : null
    if (priceNum !== null && (isNaN(priceNum) || priceNum < 0 || priceNum > 999999999)) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    let error = null

    if (role === 'vendeur') {
      if (!city || city.length > 100) return NextResponse.json({ error: 'Localité invalide' }, { status: 400 })
      if (!region || !VALID_DEPARTEMENTS.includes(region)) return NextResponse.json({ error: 'Département invalide' }, { status: 400 })
      const { error: e } = await supabase.from('products').insert({
        vendeur_id: user.id,
        category_id: catId,
        nom: title.trim(),
        description: description.trim(),
        prix_unitaire: priceNum,
        unite_mesure: unit?.trim() || null,
        stock_actuel: stock_actuel || 1,
        image_url: image_url || null,
        images: imagesJson,
        localite: city.trim(),
        departement: region,
        is_active: true,
      })
      error = e
    } else if (role === 'prestataire') {
      if (!city || city.length > 100) return NextResponse.json({ error: 'Localité invalide' }, { status: 400 })
      if (!region || !VALID_DEPARTEMENTS.includes(region)) return NextResponse.json({ error: 'Département invalide' }, { status: 400 })
      const { error: e } = await supabase.from('services').insert({
        prestataire_id: user.id,
        type_service: type_service || 'prestation',
        titre: title.trim(),
        description: description.trim(),
        tarif_base: priceNum,
        est_disponible: true,
        unite: unit?.trim() || null,
        image_url: image_url || null,
        images: imagesJson,
        localite: city.trim(),
        departement: region,
      })
      error = e
    } else {
      if (!city || city.length > 100) return NextResponse.json({ error: 'Localité invalide' }, { status: 400 })
      if (!region || !VALID_DEPARTEMENTS.includes(region)) return NextResponse.json({ error: 'Département invalide' }, { status: 400 })
      const { error: e } = await supabase.from('listings').insert({
        client_id: user.id,
        category_id: catId,
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        unit: unit?.trim() || null,
        image_url: image_url || null,
        images: imagesJson,
        localite: city.trim(),
        departement: region,
        is_pre_sale: is_pre_sale || false,
        harvest_date: harvest_date || null,
        status: 'disponible',
      })
      error = e
    }

    if (error) throw error
    await invalidateAdsCache(getContentType({ _role: role }))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/ads:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors de la publication' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const role = await getUserRole(supabase, user.id)
    const body = await request.json()
    const { id, contentType, title, description, price, unit, category_id, city, region, image_url, images, is_pre_sale, harvest_date, stock_actuel, type_service } = body

    if (!id || !contentType) {
      return NextResponse.json({ error: 'id et contentType requis' }, { status: 400 })
    }

    const table = TABLE_MAP[contentType]
    if (!table) {
      return NextResponse.json({ error: 'Type de contenu invalide' }, { status: 400 })
    }

    const { data: row } = await supabase.from(table).select(OWNER_COL[table]).eq('id', id).maybeSingle()
    if (!row) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    }
    if (row[OWNER_COL[table]] !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    if (title && (title.length > 80)) {
      return NextResponse.json({ error: 'Titre invalide (max 80 caractères)' }, { status: 400 })
    }
    if (description && (description.length > 2000)) {
      return NextResponse.json({ error: 'Description invalide (max 2000 caractères)' }, { status: 400 })
    }
    const catId = category_id ? parseInt(category_id) : null
    if (catId !== null && (isNaN(catId) || catId <= 0)) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }
    const priceNum = price !== undefined && price !== '' ? parseFloat(price) : undefined
    if (priceNum !== undefined && (isNaN(priceNum) || priceNum < 0 || priceNum > 999999999)) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    const updateData = {}
    if (table === 'products') {
      if (title !== undefined) updateData.nom = title.trim()
      if (description !== undefined) updateData.description = description.trim()
      if (priceNum !== undefined) updateData.prix_unitaire = priceNum
      if (unit !== undefined) updateData.unite_mesure = unit?.trim() || null
      if (stock_actuel !== undefined) updateData.stock_actuel = stock_actuel
      if (catId !== null) updateData.category_id = catId
      if (city !== undefined) updateData.localite = city?.trim()
      if (region !== undefined) updateData.departement = region
      if (image_url !== undefined) updateData.image_url = image_url
      if (images !== undefined) updateData.images = Array.isArray(images) && images.length > 0 ? images : null
    } else if (table === 'services') {
      if (title !== undefined) updateData.titre = title.trim()
      if (description !== undefined) updateData.description = description.trim()
      if (priceNum !== undefined) updateData.tarif_base = priceNum
      if (unit !== undefined) updateData.unite = unit?.trim() || null
      if (catId !== null) updateData.category_id = catId
      if (city !== undefined) updateData.localite = city?.trim()
      if (region !== undefined) updateData.departement = region
      if (image_url !== undefined) updateData.image_url = image_url
      if (images !== undefined) updateData.images = Array.isArray(images) && images.length > 0 ? images : null
    } else {
      if (title !== undefined) updateData.title = title.trim()
      if (description !== undefined) updateData.description = description.trim()
      if (priceNum !== undefined) updateData.price = priceNum
      if (unit !== undefined) updateData.unit = unit?.trim() || null
      if (catId !== null) updateData.category_id = catId
      if (city !== undefined) updateData.localite = city?.trim()
      if (region !== undefined) updateData.departement = region
      if (image_url !== undefined) updateData.image_url = image_url
      if (images !== undefined) updateData.images = Array.isArray(images) && images.length > 0 ? images : null
      if (is_pre_sale !== undefined) updateData.is_pre_sale = is_pre_sale
      if (harvest_date !== undefined) updateData.harvest_date = harvest_date || null
    }

    const { error } = await supabase.from(table).update(updateData).eq('id', id)
    if (error) throw error

    await invalidateAdsCache(contentType)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/ads:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id, contentType } = await request.json()
    if (!id || !contentType) {
      return NextResponse.json({ error: 'id et contentType requis' }, { status: 400 })
    }

    const table = TABLE_MAP[contentType]
    if (!table) {
      return NextResponse.json({ error: 'Type de contenu invalide' }, { status: 400 })
    }

    const { data: row } = await supabase.from(table).select(OWNER_COL[table]).eq('id', id).maybeSingle()
    if (!row) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    }
    if (row[OWNER_COL[table]] !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error

    await invalidateAdsCache(contentType)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/ads:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors de la suppression' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id, contentType } = await request.json()
    if (!id || !contentType) {
      return NextResponse.json({ error: 'id et contentType requis' }, { status: 400 })
    }

    const table = TABLE_MAP[contentType]
    if (!table) {
      return NextResponse.json({ error: 'Type de contenu invalide' }, { status: 400 })
    }

    const { data: row } = await supabase.from(table).select(OWNER_COL[table] + ', ' + ACTIVE_COL[table]).eq('id', id).maybeSingle()
    if (!row) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    }
    if (row[OWNER_COL[table]] !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    let newActive
    if (table === 'listings') {
      newActive = row.status === 'disponible' ? 'inactive' : 'disponible'
    } else {
      newActive = !row[ACTIVE_COL[table]]
    }

    const updatePayload = {}
    if (table === 'listings') {
      updatePayload.status = newActive
    } else {
      updatePayload[ACTIVE_COL[table]] = newActive
    }

    const { error } = await supabase.from(table).update(updatePayload).eq('id', id)
    if (error) throw error

    await invalidateAdsCache(contentType)
    return NextResponse.json({ success: true, active: table === 'listings' ? newActive === 'disponible' : newActive })
  } catch (err) {
    console.error('PATCH /api/ads:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors du changement de statut' }, { status: 500 })
  }
}
