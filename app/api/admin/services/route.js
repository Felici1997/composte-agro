import { getAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { NextResponse } from 'next/server'

const ALLOWED_COLS = ['type_service', 'titre', 'description', 'tarif_base', 'est_disponible', 'departement', 'localite']

function sanitize(body) {
  const clean = {}
  for (const key of ALLOWED_COLS) {
    if (key in body) clean[key] = body[key]
  }
  return clean
}

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const admin = getAdminClient()
    const { error } = await admin.from('services').insert({
      ...sanitize(body),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/admin/services:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { id } = body
    const admin = getAdminClient()
    const { error } = await admin.from('services').update({
      ...sanitize(body),
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/services:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin()
    const { id } = await request.json()
    const admin = getAdminClient()
    const { error } = await admin.from('services').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/services:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}
