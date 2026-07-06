'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { PlusCircle, Package } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { formatPrice } from '@/lib/categories'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const allAds = useSelector(state => state.ads.list)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      const { data: ords } = await supabase.from('orders').select('*').eq('buyer_id', session.user.id).order('created_at', { ascending: false }).limit(10)
      if (ords) setOrders(ords)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) return <div className="text-center py-20 text-slate-400">Chargement...</div>

  const uid = user?.id
  const userAds = allAds.filter(a =>
    a.seller_id === uid || a.vendeur_id === uid || a.prestataire_id === uid
  )

  const statusLabel = { pending: 'En attente', confirmed: 'Confirmée', processing: 'En cours', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-700">Mon tableau de bord</h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/create-ad" className="flex items-center gap-1.5 bg-composte-600 hover:bg-composte-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            <PlusCircle size={16} /> Nouvelle annonce
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-700">{userAds.length}</p>
          <p className="text-xs text-slate-400">Mes annonces</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-700">{userAds.filter(a => a.status === 'active' || a.is_active).length}</p>
          <p className="text-xs text-slate-400">Annonces actives</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-700">{orders.length}</p>
          <p className="text-xs text-slate-400">Mes commandes</p>
        </div>
      </div>

      {orders.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Package size={16} /> Mes commandes</h2>
          <div className="space-y-2 mb-8">
            {orders.map(o => (
              <div key={o.id} className="bg-white border rounded-xl p-4 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-700">Commande #{String(o.id).slice(0, 8)}</p>
                  <p className="text-xs text-slate-400">{new Date(o.created_at).toLocaleDateString('fr-FR')}</p>
                  {o.lieu_livraison && <p className="text-xs text-slate-400">Livraison : {o.lieu_livraison}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700">{formatPrice(o.total_amount)}</p>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{statusLabel[o.status] || o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="text-sm font-semibold text-slate-700 mb-3">Mes annonces</h2>
      {userAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <p className="text-slate-400 font-medium">Vous n'avez pas encore d'annonce</p>
          <Link href="/create-ad" className="inline-block mt-2 text-sm text-composte-600 hover:underline">Déposer votre première annonce</Link>
        </div>
      )}
    </div>
  )
}
