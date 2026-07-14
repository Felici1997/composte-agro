import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const VALID_DEPARTEMENTS = ['Brazzaville', 'Pointe-Noire', 'Pool', 'Bouenza', 'Lékoumou', 'Niari', 'Plateaux', 'Cuvette', 'Cuvette-Ouest', 'Sangha', 'Likouala']

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get user role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const role = profile?.role || 'client'

    const body = await request.json()
    const { title, description, price, unit, category_id, city, region, image_url, is_pre_sale, harvest_date, stock_actuel, type_service } = body

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
        localite: city.trim(),
        departement: region,
      })
      error = e
    } else {
      const { error: e } = await supabase.from('listings').insert({
        seller_id: user.id,
        category_id: catId,
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        unit: unit?.trim() || null,
        image_url: image_url || null,
        is_pre_sale: is_pre_sale || false,
        harvest_date: harvest_date || null,
        status: 'disponible',
      })
      error = e
    }

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/ads:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors de la publication' }, { status: 500 })
  }
}
