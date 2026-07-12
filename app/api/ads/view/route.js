import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const TABLE_MAP = { listing: 'listings', product: 'products', service: 'services' }
const OWNER_COL = { listings: 'seller_id', products: 'vendeur_id', services: 'prestataire_id' }

export async function POST(request) {
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

    const admin = getAdminClient()
    const { data: row } = await admin.from(table).select(OWNER_COL[table]).eq('id', id).maybeSingle()
    if (!row) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    }

    if (row[OWNER_COL[table]] === user.id) {
      return NextResponse.json({ success: true, skipped: true })
    }

    await admin.rpc('increment_views', { tbl: table, row_id: String(id) })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/ads/view:', err)
    return NextResponse.json({ error: err.message || 'Erreur interne' }, { status: 500 })
  }
}
