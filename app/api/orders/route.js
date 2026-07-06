import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, nom_complet, telephone')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) {
      return NextResponse.json({ error: 'Créez un compte' }, { status: 400 })
    }

    const body = await request.json()
    const { items, nom_complet, telephone, lieu_livraison } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }
    if (!nom_complet || nom_complet.length > 100) {
      return NextResponse.json({ error: 'Nom invalide' }, { status: 400 })
    }
    if (!telephone || telephone.length > 30) {
      return NextResponse.json({ error: 'Téléphone invalide' }, { status: 400 })
    }
    if (!lieu_livraison || lieu_livraison.length > 200) {
      return NextResponse.json({ error: 'Lieu de livraison invalide' }, { status: 400 })
    }

    const total_amount = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)

    const productIds = items.map(i => parseInt(i.id)).filter(id => !isNaN(id))
    if (productIds.length === 0) {
      return NextResponse.json({ error: 'Aucun produit valide dans le panier' }, { status: 400 })
    }

    const { data: validProducts } = await supabase
      .from('products')
      .select('id, prix_unitaire, vendeur_id')
      .in('id', productIds)

    if (!validProducts || validProducts.length === 0) {
      return NextResponse.json({ error: 'Produits introuvables' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        vendeur_id: validProducts[0].vendeur_id,
        total_amount,
        status: 'pending',
        nom_complet: nom_complet.trim(),
        telephone: telephone.trim(),
        lieu_livraison: lieu_livraison.trim(),
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
    }

    await supabase.from('profiles').update({
      nom_complet: nom_complet.trim(),
      telephone: telephone.trim(),
    }).eq('id', user.id)

    const orderItems = items
      .map(i => ({ id: parseInt(i.id), quantity: i.quantity }))
      .filter(i => validProducts.find(p => p.id === i.id))
      .map(i => {
        const unitPrice = validProducts.find(p => p.id === i.id).prix_unitaire || i.price || 0
        return {
          order_id: order.id,
          product_id: i.id,
          quantity: i.quantity,
          prix_unitaire: unitPrice,
          total_price: unitPrice * i.quantity,
        }
      })

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      console.error('Order items insert error:', itemsError)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement des articles' }, { status: 500 })
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('POST /api/orders:', err)
    return NextResponse.json({ error: 'Erreur lors de la commande' }, { status: 500 })
  }
}
