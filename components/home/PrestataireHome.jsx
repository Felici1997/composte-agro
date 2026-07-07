'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Wrench, PlusCircle, ShoppingBag, User } from 'lucide-react'
import { fetchListingsByCategoryIds, fetchUserServices } from '@/lib/supabase/queries'
import { formatPrice, getCategoryById } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import AdCard from '@/components/AdCard'

export default function PrestataireHome() {
  const [user, setUser] = useState(null)
  const [demandes, setDemandes] = useState([])
  const [mesServices, setMesServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        const [listings, services] = await Promise.all([
          fetchListingsByCategoryIds([43]),
          fetchUserServices(session.user.id),
        ])
        setDemandes(listings)
        setMesServices(services)
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-xl font-semibold">Espace prestataire</h1>
        <p className="text-sm text-white/80 mt-1">Gérez vos services et répondez aux demandes</p>
        <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-purple-700 font-medium px-5 py-2.5 rounded-lg mt-4 text-sm hover:bg-purple-50 transition">
          <PlusCircle size={18} /> Ajouter un service
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-700">{mesServices.length}</p>
          <p className="text-xs text-slate-400">Mes services</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-2xl font-bold text-slate-700">{demandes.length}</p>
          <p className="text-xs text-slate-400">Demandes de services</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Wrench size={16} /> Mes services</h2>
      {loading ? (
        <div className="text-center py-12 text-slate-400">Chargement...</div>
      ) : mesServices.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {mesServices.map(s => <AdCard key={s._key || s.id} ad={s} />)}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl mb-8">
          <p className="text-sm">Vous n'avez pas encore de service</p>
        </div>
      )}

      <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><ShoppingBag size={16} /> Demandes de services</h2>
      {demandes.length > 0 ? (
        <div className="space-y-2">
          {demandes.map(d => (
            <div key={d._key || d.id} className="bg-white border rounded-xl p-4 flex items-center justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 truncate">{d.title}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                  {d.price != null && <span>{formatPrice(d.price)}</span>}
                  {d._profile && <span className="flex items-center gap-1"><User size={12} /> {d._profile.nom_complet}</span>}
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <Link href={`/ad/${d.id}`} className="text-composte-600 hover:underline text-xs font-medium">Voir →</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
          <p className="text-sm">Aucune demande de service pour le moment</p>
        </div>
      )}
    </div>
  )
}
