import { getAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { user } = await requireAdmin()
    const { conversation_id, sender_id, content } = await request.json()
    if (!conversation_id || !content?.trim()) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }
    const admin = getAdminClient()

    const { error: msgError } = await admin.from('messages').insert({
      conversation_id,
      sender_id: user.id,
      sender_role: 'assistant',
      content: content.trim(),
    })
    if (msgError) throw msgError

    await admin.from('conversations').update({
      last_message: content.trim(),
      last_message_at: new Date().toISOString(),
    }).eq('id', conversation_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/admin/messages:', err)
    return NextResponse.json({ error: err.message === 'Non authentifié' || err.message === 'Accès refusé' ? err.message : 'Erreur interne' }, { status: 500 })
  }
}
