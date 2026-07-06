import { getAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { NextResponse } from 'next/server'

export async function PUT(request) {
  try {
    await requireAdmin()
    const { id, status } = await request.json()
    if (!['active', 'closed', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }
    const admin = getAdminClient()
    const { error } = await admin.from('conversations').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT /api/admin/conversations:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}
