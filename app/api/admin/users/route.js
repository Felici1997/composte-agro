import { getAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { NextResponse } from 'next/server'

const ALLOWED_COLS = ['nom_complet', 'telephone', 'departement', 'commune', 'email', 'role']

function sanitize(body) {
  const clean = {}
  for (const key of ALLOWED_COLS) {
    if (key in body) clean[key] = body[key]
  }
  return clean
}

export async function PUT(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { id } = body
    const admin = getAdminClient()
    const { error } = await admin.from('profiles').update(sanitize(body)).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/users:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}
