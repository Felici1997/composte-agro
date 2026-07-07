'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Package, PlusCircle, ShoppingBag, MapPin, User, Tag, TrendingUp, Clock, Eye, ChevronRight } from 'lucide-react'
import { fetchListingsByCategoryIds } from '@/lib/supabase/queries'
import { formatPrice, getCategoryById } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import AdCard from '@/components/AdCard'

export default function VendeurHome() {
  const [user, setUser] = useState(null)
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const { list: ads } = useSelector(state => state.ads)
  const mesProduits = ads.filter(a => a.contentType === 'product' && a.vendeur_id === user?.id)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        const nonServiceIds = [1, 2, 6, 7, 42]
        const listings = await fetchListingsByCategoryIds(nonServiceIds)
        setDemandes(listings)
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Tag size={12} /> Espace vendeur
          </div>
          <h1 className="text-2xl font-bold">Bienvenue dans votre boutique</h1>
          <p className="text-sm text-emerald-100 mt-1 max-w-md">
            Gérez vos produits, suivez vos ventes et trouvez de nouveaux clients
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition shadow-lg shadow-emerald-900/20">
              <PlusCircle size={18} /> Ajouter un produit
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-white/25 transition">
              Tableau de bord <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Package size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{mesProduits.length}</p>
              <p className="text-xs text-slate-400">Produits en vente</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{demandes.length}</p>
              <p className="text-xs text-slate-400">Demandes clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">0</p>
              <p className="text-xs text-slate-400">Ventes ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Eye size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">0</p>
              <p className="text-xs text-slate-400">Vues totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link href="/create-ad" className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl p-3 text-sm font-medium text-emerald-700 transition">
          <PlusCircle size={18} /> Nouveau produit
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
          <Package size={18} /> Mes produits
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
          <Clock size={18} /> Commandes
        </Link>
        <Link href="/search" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
          <ShoppingBag size={18} /> Explorer
        </Link>
      </div>

      {/* Mes produits */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Mes produits</h2>
          {mesProduits.length > 0 && (
            <Link href="/dashboard" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              Tout voir <ChevronRight size={14} />
            </Link>
          )}
        </div>
        {mesProduits.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mesProduits.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-3">
              <Package size={28} className="text-emerald-400" />
            </div>
            <p className="text-slate-500 font-medium">Vous n'avez pas encore de produit</p>
            <p className="text-xs text-slate-400 mt-1">Ajoutez votre premier produit pour commencer à vendre</p>
            <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-4 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition">
              <PlusCircle size={16} /> Ajouter un produit
            </Link>
          </div>
        )}
      </div>

      {/* Demandes clients récentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Demandes récentes des clients</h2>
          <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full">{demandes.length} nouvelle{demandes.length > 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : demandes.length > 0 ? (
          <div className="space-y-2">
            {demandes.slice(0, 5).map(d => (
              <Link key={d._key || d.id} href={`/ad/${d.id}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{d.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      {d._category && (
                        <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                          <Tag size={10} /> {d._category.nom}
                        </span>
                      )}
                      {d.price != null && (
                        <span className="font-semibold text-emerald-600">{formatPrice(d.price)}</span>
                      )}
                      {d._profile && (
                        <span className="flex items-center gap-1">
                          <User size={12} /> {d._profile.nom_complet || 'Anonyme'}
                        </span>
                      )}
                      {d.created_at && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(d.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition">
                      Voir <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
              <ShoppingBag size={28} className="text-blue-400" />
            </div>
            <p className="text-slate-500 font-medium">Aucune demande pour le moment</p>
            <p className="text-xs text-slate-400 mt-1">Soyez le premier informé dès qu'un client publie une demande</p>
          </div>
        )}
      </div>
    </div>
  )
}
