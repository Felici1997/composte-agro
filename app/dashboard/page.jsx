'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { PlusCircle, Package, ShoppingBag, Wrench, TrendingUp, Eye, Clock, ChevronRight, User, MapPin, Store, ClipboardList, Star, Settings } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { formatPrice } from '@/lib/categories'
import PromoDashboard from '@/components/ads/PromoDashboard'

const statusLabel = { pending: 'En attente', confirmed: 'Confirmée', processing: 'En cours', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' }
const statusColor = { pending: 'bg-amber-50 text-amber-600', confirmed: 'bg-blue-50 text-blue-600', processing: 'bg-indigo-50 text-indigo-600', shipped: 'bg-purple-50 text-purple-600', delivered: 'bg-green-50 text-green-600', cancelled: 'bg-red-50 text-red-600' }

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [userDemandes, setUserDemandes] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [userServices, setUserServices] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      setProfile(p)
      const [ords, listings, products, services] = await Promise.all([
        supabase.from('orders').select('*').eq('buyer_id', session.user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('listings').select('*').eq('seller_id', session.user.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('products').select('*').eq('vendeur_id', session.user.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('services').select('*').eq('prestataire_id', session.user.id).order('created_at', { ascending: false }).limit(50),
      ])
      if (ords.data) setOrders(ords.data)
      if (listings.data) setUserDemandes(listings.data.map(l => ({ ...l, _key: `listing_${l.id}`, contentType: 'listing' })))
      if (products.data) setUserProducts(products.data.map(p => ({ ...p, _key: `product_${p.id}`, contentType: 'product' })))
      if (services.data) setUserServices(services.data.map(s => ({ ...s, _key: `service_${s.id}`, contentType: 'service' })))
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><Skeleton /></div>

  const role = profile?.role || 'client'
  const uid = user?.id
  const totalViews = role === 'client'
    ? userDemandes.reduce((s, a) => s + (a.views || 0), 0)
    : role === 'vendeur'
    ? userProducts.reduce((s, a) => s + (a.views || 0), 0)
    : userServices.reduce((s, a) => s + (a.views || 0), 0)
  const gradient = role === 'vendeur' ? 'from-emerald-500 via-emerald-600 to-green-700' : role === 'prestataire' ? 'from-purple-500 via-purple-600 to-indigo-700' : 'from-agrishop-500 via-agrishop-600 to-emerald-700'
  const accentColor = role === 'vendeur' ? 'emerald' : role === 'prestataire' ? 'purple' : 'agrishop'
  const roleLabel = role === 'vendeur' ? 'Vendeur' : role === 'prestataire' ? 'Prestataire' : 'Client'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 md:p-8 mb-8 text-white`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3">
                <User size={12} /> {roleLabel}
              </div>
              <h1 className="text-xl font-bold">Bonjour, {profile?.nom_complet || user?.email?.split('@')[0]}</h1>
              <p className="text-sm text-white/70 mt-0.5">{user?.email}</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link href={`/create-ad`} className={`inline-flex items-center gap-1.5 bg-white text-${accentColor}-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-${accentColor}-50 transition shadow-lg`}>
                <PlusCircle size={18} /> {role === 'client' ? 'Nouvelle annonce' : role === 'vendeur' ? 'Nouveau produit' : 'Nouveau service'}
              </Link>
              <Link href="/profile" className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-white/25 transition">
                <Settings size={16} />
              </Link>
            </div>
          </div>
          <div className="flex sm:hidden mt-4">
            <Link href="/create-ad" className={`inline-flex items-center gap-1.5 bg-white text-${accentColor}-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-${accentColor}-50 transition shadow-lg`}>
              <PlusCircle size={18} /> Nouveau
            </Link>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link href="/create-ad" className={`flex items-center gap-2 bg-${accentColor}-50 hover:bg-${accentColor}-100 border border-${accentColor}-200 rounded-xl p-3 text-sm font-medium text-${accentColor}-700 transition`}>
          <PlusCircle size={18} /> {role === 'client' ? 'Annonce' : role === 'vendeur' ? 'Produit' : 'Service'}
        </Link>
        <Link href="/search" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
          <Store size={18} /> Explorer
        </Link>
        <Link href="/favorites" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
          <Star size={18} /> Favoris
        </Link>
        {role === 'client' && (
          <Link href="/cart" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 transition">
            <ShoppingBag size={18} /> Panier
          </Link>
        )}
      </div>

      <PromoDashboard role={role} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {role === 'client' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{userDemandes.length}</p>
                <p className="text-xs text-slate-400">Mes annonces</p>
              </div>
            </div>
          </div>
        )}
        {role === 'vendeur' && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Package size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{userProducts.length}</p>
                  <p className="text-xs text-slate-400">Produits</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{userDemandes.length}</p>
                  <p className="text-xs text-slate-400">Demandes reçues</p>
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
                  <p className="text-xs text-slate-400">Ventes</p>
                </div>
              </div>
            </div>
          </>
        )}
        {role === 'prestataire' && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Wrench size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{userServices.length}</p>
                  <p className="text-xs text-slate-400">Services</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{userDemandes.length}</p>
                  <p className="text-xs text-slate-400">Demandes</p>
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
                  <p className="text-xs text-slate-400">Missions</p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <ClipboardList size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
              <p className="text-xs text-slate-400">Commandes</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <Eye size={20} className="text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalViews > 0 ? totalViews : '—'}</p>
              <p className="text-xs text-slate-400">Vues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
      {orders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Package size={18} /> Mes commandes</h2>
            {orders.length > 5 && (
              <Link href="/admin/commandes" className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1">
                Tout voir <ChevronRight size={14} />
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Package size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">Commande #{String(o.id).slice(0, 8)}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{new Date(o.created_at).toLocaleDateString('fr-FR')}</span>
                        {o.lieu_livraison && <><span>·</span><span className="flex items-center gap-1"><MapPin size={10} /> {o.lieu_livraison}</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-sm">{formatPrice(o.total_amount)}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status] || 'bg-slate-50 text-slate-600'}`}>{statusLabel[o.status] || o.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mes annonces / produits / services */}
      {role === 'client' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ClipboardList size={18} /> Mes annonces</h2>
            {userDemandes.length > 0 && (
              <Link href="/search" className="text-xs text-agrishop-600 hover:text-agrishop-700 font-medium flex items-center gap-1">
                Tout voir <ChevronRight size={14} />
              </Link>
            )}
          </div>
          {userDemandes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userDemandes.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-3">
                <ClipboardList size={28} className="text-emerald-400" />
              </div>
              <p className="text-slate-500 font-medium">Vous n'avez pas encore d'annonce</p>
              <p className="text-xs text-slate-400 mt-1">Publiez votre première annonce gratuitement</p>
              <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-4 bg-agrishop-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-agrishop-700 transition">
                <PlusCircle size={16} /> Publier une annonce
              </Link>
            </div>
          )}
        </div>
      )}

      {role === 'vendeur' && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Package size={18} /> Mes produits</h2>
              {userProducts.length > 0 && (
                <Link href="/admin/produits" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                  Gérer <ChevronRight size={14} />
                </Link>
              )}
            </div>
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userProducts.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-3">
                  <Package size={28} className="text-emerald-400" />
                </div>
                <p className="text-slate-500 font-medium">Vous n'avez pas encore de produit</p>
                <p className="text-xs text-slate-400 mt-1">Ajoutez votre premier produit pour commencer à vendre</p>
                <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-4 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition">
                  <PlusCircle size={16} /> Ajouter un produit
                </Link>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ShoppingBag size={18} /> Demandes des clients</h2>
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">{userDemandes.length} nouvelle{userDemandes.length > 1 ? 's' : ''}</span>
            </div>
            {userDemandes.length > 0 ? (
              <div className="space-y-2">
                {userDemandes.map(d => (
                  <Link key={d._key || d.id} href={`/ad/${d.id}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <ShoppingBag size={16} className="text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{d.title}</p>
                          {d.price != null && <p className="text-xs text-emerald-600 font-medium mt-0.5">{formatPrice(d.price)}</p>}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition shrink-0 ml-3">
                        Voir <ChevronRight size={14} />
                      </span>
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
                <p className="text-xs text-slate-400 mt-1">Les demandes des clients apparaîtront ici</p>
              </div>
            )}
          </div>
        </>
      )}

      {role === 'prestataire' && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Wrench size={18} /> Mes services</h2>
              {userServices.length > 0 && (
                <Link href="/admin/services" className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Gérer <ChevronRight size={14} />
                </Link>
              )}
            </div>
            {userServices.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userServices.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-3">
                  <Wrench size={28} className="text-purple-400" />
                </div>
                <p className="text-slate-500 font-medium">Vous n'avez pas encore de service</p>
                <p className="text-xs text-slate-400 mt-1">Proposez votre premier service aux clients</p>
                <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-4 bg-purple-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-purple-700 transition">
                  <PlusCircle size={16} /> Ajouter un service
                </Link>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ShoppingBag size={18} /> Demandes de services</h2>
            </div>
            {userDemandes.length > 0 ? (
              <div className="space-y-2">
                {userDemandes.map(d => (
                  <Link key={d._key || d.id} href={`/ad/${d.id}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-purple-200 hover:shadow-sm transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <Wrench size={16} className="text-purple-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{d.title}</p>
                          {d.price != null && <p className="text-xs text-green-600 font-medium mt-0.5">{formatPrice(d.price)}</p>}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition shrink-0 ml-3">
                        Voir <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-300 rounded-2xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-3">
                  <ShoppingBag size={28} className="text-purple-400" />
                </div>
                <p className="text-slate-500 font-medium">Aucune demande pour le moment</p>
                <p className="text-xs text-slate-400 mt-1">Les demandes de services apparaîtront ici</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
