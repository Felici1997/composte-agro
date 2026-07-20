'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wrench, PlusCircle, ShoppingBag, User, ChevronRight, Briefcase } from 'lucide-react'
import { fetchListingsByCategoryIds, fetchUserServices } from '@/lib/supabase/queries'
import { formatPrice } from '@/lib/categories'
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
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 rounded-3xl p-8 md:p-10 mb-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium mb-4 border border-white/10">
            <Briefcase size={12} /> Espace prestataire
          </div>
          <h1 className="text-2xl font-bold">Bonjour, prestataire</h1>
          <p className="text-sm text-white/80 mt-1.5 max-w-md">G\u00e9rez vos services et r\u00e9pondez aux demandes de vos clients.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/create-ad" className="inline-flex items-center gap-2 bg-white text-violet-800 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-violet-50 transition shadow-lg shadow-black/10">
              <PlusCircle size={18} /> Ajouter un service
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition">
              Tableau de bord <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-agrishop-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0"><Wrench size={20} className="text-violet-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{mesServices.length}</p><p className="text-xs text-slate-500">Mes services</p></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-agrishop-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><ShoppingBag size={20} className="text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{demandes.length}</p><p className="text-xs text-slate-500">Clients</p></div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Mes services</h2>
          {mesServices.length > 0 && <Link href="/dashboard" className="text-sm font-medium text-violet-700 hover:text-violet-800 hover:underline">Tout voir \u2192</Link>}
        </div>
        {loading ? <div className="text-center py-12 text-slate-400">Chargement...</div> : mesServices.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{mesServices.map(s => <AdCard key={s._key || s.id} ad={s} />)}</div>
        ) : (
          <div className="text-center py-14 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 mb-3"><Wrench size={28} className="text-violet-400" /></div>
            <p className="text-slate-500 font-medium">Vous n&apos;avez pas encore de service</p>
            <p className="text-xs text-slate-400 mt-1">Proposez votre premier service aux clients</p>
            <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-4 bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-violet-700 transition shadow-sm">
              <PlusCircle size={16} /> Ajouter un service
            </Link>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Clients</h2>
        </div>
        {demandes.length > 0 ? (
          <div className="space-y-2">
            {demandes.map(d => (
              <Link key={d._key || d.id} href={'/ad/' + d.id} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{d.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                      {d.price != null && <span className="font-semibold text-emerald-600">{formatPrice(d.price)}</span>}
                      {d._profile && <span className="flex items-center gap-1"><User size={12} /> {d._profile.nom_complet}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 ml-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition">Voir <ChevronRight size={14} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 mb-3"><ShoppingBag size={28} className="text-violet-400" /></div>
            <p className="text-slate-500 font-medium">Aucune demande de service pour le moment</p>
            <p className="text-xs text-slate-400 mt-1">Les demandes appara\u00eetront ici</p>
          </div>
        )}
      </div>
    </div>
  )
}
