import { getAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { NextResponse } from 'next/server'

const ALLOWED_COLS = ['nom', 'description', 'prix_unitaire', 'unite_mesure', 'stock_actuel', 'category_id', 'departement', 'localite', 'image_url', 'is_active']

function sanitize(body) {
  const clean = {}
  for (const key of ALLOWED_COLS) {
    if (key in body) clean[key] = body[key]
  }
  return clean
}

export async function POST(request) {
  try {
    const { user } = await requireAdmin()
    const body = await request.json()
    const admin = getAdminClient()
    const { error } = await admin.from('products').insert({
      ...sanitize(body),
      vendeur_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/admin/products:', err)
    const msg = err.message || ''
    return NextResponse.json({ error: msg === 'Non authentifié' || msg === 'Accès refusé' ? msg : 'Erreur interne' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { user } = await requireAdmin()
    const body = await request.json()
    const { id } = body
    const admin = getAdminClient()
    const { error } = await admin.from('products').update({
      ...sanitize(body),
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/products:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin()
    const { id } = await request.json()
    const admin = getAdminClient()
    const { error } = await admin.from('products').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/products:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}
