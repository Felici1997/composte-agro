'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { PlusCircle, Package, ShoppingBag, Wrench, TrendingUp, Eye, Clock, ChevronRight, User, MapPin, Store, ClipboardList, Star, Settings, Leaf, Edit3, Trash2, ToggleLeft, ToggleRight, X, AlertTriangle } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { formatPrice } from '@/lib/categories'
import PromoDashboard from '@/components/ads/PromoDashboard'

const statusLabel = { pending: 'En attente', confirmed: 'Confirmée', processing: 'En cours', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' }
const statusColor = { pending: 'bg-amber-50 text-amber-600', confirmed: 'bg-blue-50 text-blue-600', processing: 'bg-indigo-50 text-indigo-600', shipped: 'bg-purple-50 text-purple-600', delivered: 'bg-green-50 text-green-600', cancelled: 'bg-red-50 text-red-600' }

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>
  )
}

export default function DashboardContent() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState([])
  const [userDemandes, setUserDemandes] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [userServices, setUserServices] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      setProfile(p)
      const [ords, listings, products, services] = await Promise.all([
        supabase.from('orders').select('*').eq('buyer_id', session.user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('listings').select('*').eq('client_id', session.user.id).order('created_at', { ascending: false }).limit(50),
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

  const handleToggle = async (ad) => {
    setActionLoading(ad._key || ad.id)
    try {
      const res = await fetch('/api/ads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id, contentType: ad.contentType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const setter = ad.contentType === 'product' ? setUserProducts : ad.contentType === 'service' ? setUserServices : setUserDemandes
      const updater = (prev) => prev.map(a => a.id === ad.id ? { ...a, [ad.contentType === 'product' ? 'is_active' : ad.contentType === 'service' ? 'est_disponible' : 'status']: ad.contentType === 'listing' ? (data.active ? 'disponible' : 'inactive') : data.active } : a)
      setter(updater)
      toast.success(data.active ? 'Annonce activée' : 'Annonce désactivée')
    } catch (err) {
      toast.error(err.message || 'Erreur')
    } finally { setActionLoading(null) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setActionLoading(confirmDelete._key || confirmDelete.id)
    try {
      const res = await fetch('/api/ads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmDelete.id, contentType: confirmDelete.contentType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const setter = confirmDelete.contentType === 'product' ? setUserProducts : confirmDelete.contentType === 'service' ? setUserServices : setUserDemandes
      setter(prev => prev.filter(a => a.id !== confirmDelete.id))
      toast.success('Annonce supprimée')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression')
    } finally { setActionLoading(null) }
  }

  const isAdActive = (ad) => {
    if (ad.contentType === 'listing') return ad.status === 'disponible'
    if (ad.contentType === 'product') return ad.is_active
    if (ad.contentType === 'service') return ad.est_disponible
    return true
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><Skeleton /></div>

  const role = profile?.role || 'client'
  const uid = user?.id
  const totalViews = role === 'client'
    ? userDemandes.reduce((s, a) => s + (a.views || 0), 0)
    : role === 'vendeur'
    ? userProducts.reduce((s, a) => s + (a.views || 0), 0)
    : userServices.reduce((s, a) => s + (a.views || 0), 0)
  const gradient = role === 'vendeur' ? 'from-emerald-500 via-emerald-600 to-green-700' : role === 'prestataire' ? 'from-violet-500 via-violet-600 to-indigo-700' : 'from-agrishop-500 via-agrishop-600 to-emerald-700'
  const accentColor = role === 'vendeur' ? 'emerald' : role === 'prestataire' ? 'violet' : 'agrishop'
  const roleLabel = role === 'vendeur' ? 'Vendeur' : role === 'prestataire' ? 'Prestataire' : 'Client'

  return (
    <div className={`min-h-screen bg-gradient-to-b from-agrishop-50/30 via-white to-emerald-50/20 pb-10 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl`}>
          <img src="/images/illustrations/self-confidence-bro.svg" alt="" className="absolute right-0 top-0 h-full w-auto object-contain opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-heading">Bonjour, {profile?.nom_complet || user?.email?.split('@')[0]}</h1>
                <p className="text-sm text-white/70 mt-0.5">{user?.email}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  <PlusCircle size={18} /> {role === 'client' ? 'Nouvelle annonce' : role === 'vendeur' ? 'Nouveau produit' : 'Nouveau service'}
                </Link>
                <Link href="/profile" className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-white/25 transition-all duration-200">
                  <Settings size={16} />
                </Link>
              </div>
            </div>
            <div className="flex sm:hidden mt-4">
              <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all duration-200 shadow-lg">
                <PlusCircle size={18} /> Nouveau
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link href="/create-ad" className="flex items-center gap-2.5 bg-agrishop-50 hover:bg-agrishop-100 border border-agrishop-200 rounded-2xl p-3.5 text-sm font-medium text-agrishop-700 transition-all duration-200 hover:shadow-sm">
            <PlusCircle size={18} className="shrink-0" /> {role === 'client' ? 'Annonce' : role === 'vendeur' ? 'Produit' : 'Service'}
          </Link>
          <Link href="/search" className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:shadow-sm">
            <Store size={18} className="shrink-0" /> Explorer
          </Link>
          <Link href="/favorites" className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:shadow-sm">
            <Star size={18} className="shrink-0" /> Favoris
          </Link>
          {role === 'client' && (
            <Link href="/cart" className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:shadow-sm">
              <ShoppingBag size={18} className="shrink-0" /> Panier
            </Link>
          )}
        </div>

        <PromoDashboard role={role} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {role === 'client' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-agrishop-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Package size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{userProducts.length}</p>
                  <p className="text-xs text-slate-400">Produits</p>
                </div>
              </div>
            </div>
          )}
          {role === 'prestataire' && (
            <>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-violet-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Wrench size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{userServices.length}</p>
                    <p className="text-xs text-slate-400">Services</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
                <p className="text-xs text-slate-400">Commandes</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 hover:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Eye size={20} className="text-slate-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{totalViews}</p>
                <p className="text-xs text-slate-400">Vues</p>
              </div>
            </div>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Package size={18} /> Mes commandes</h2>
              {orders.length > 5 && (
                <Link href="/admin/commandes" className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1 transition">
                  Tout voir <ChevronRight size={14} />
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">Commande #{String(o.id).slice(0, 8)}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={11} /> {new Date(o.created_at).toLocaleDateString('fr-FR')}</span>
                          {o.lieu_livraison && <><span>·</span><span className="flex items-center gap-1"><MapPin size={10} /> {o.lieu_livraison}</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 text-sm">{formatPrice(o.total_amount)}</p>
                      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor[o.status] || 'bg-slate-50 text-slate-600'}`}>{statusLabel[o.status] || o.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {role === 'client' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ClipboardList size={18} /> Mes annonces</h2>
              {userDemandes.length > 0 && (
                <span className="text-xs text-slate-400">Survolez une carte pour les actions</span>
              )}
            </div>
            {userDemandes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userDemandes.map(ad => (
                  <div key={ad._key || ad.id} className="relative group/ad">
                    <AdCard ad={ad} />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/ad:opacity-100 transition-opacity z-20">
                      <Link href={`/create-ad?id=${ad.id}`} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title="Modifier">
                        <Edit3 size={14} className="text-slate-600" />
                      </Link>
                      <button onClick={() => setConfirmDelete(ad)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:shadow-md transition-all" title="Supprimer">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                      <button onClick={() => handleToggle(ad)} disabled={actionLoading === (ad._key || ad.id)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title={isAdActive(ad) ? 'Désactiver' : 'Activer'}>
                        {isAdActive(ad) ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} className="text-slate-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-2xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 mb-3">
                  <ClipboardList size={28} className="text-emerald-400" />
                </div>
                <p className="text-slate-500 font-medium">Vous n&apos;avez pas encore d&apos;annonce</p>
                <p className="text-xs text-slate-400 mt-1">Publiez votre première annonce gratuitement</p>
                <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-5 bg-gradient-to-r from-agrishop-600 to-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:from-agrishop-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
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
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Package size={18} /> Mon catalogue</h2>
                {userProducts.length > 0 && (
                  <span className="text-xs text-slate-400">Survolez une carte pour les actions</span>
                )}
              </div>
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userProducts.map(ad => (
                    <div key={ad._key || ad.id} className="relative group/ad">
                      <AdCard ad={ad} />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/ad:opacity-100 transition-opacity z-20">
                        <Link href={`/create-ad?id=${ad.id}`} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title="Modifier">
                          <Edit3 size={14} className="text-slate-600" />
                        </Link>
                        <button onClick={() => setConfirmDelete(ad)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:shadow-md transition-all" title="Supprimer">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                        <button onClick={() => handleToggle(ad)} disabled={actionLoading === (ad._key || ad.id)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title={isAdActive(ad) ? 'Désactiver' : 'Activer'}>
                          {isAdActive(ad) ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} className="text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 mb-3">
                    <Package size={28} className="text-emerald-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Vous n&apos;avez pas encore de produit</p>
                  <p className="text-xs text-slate-400 mt-1">Ajoutez votre premier produit pour commencer à vendre</p>
                  <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-5 bg-gradient-to-r from-agrishop-600 to-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:from-agrishop-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    <PlusCircle size={16} /> Ajouter un produit
                  </Link>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ShoppingBag size={18} /> Demandes</h2>
                <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-0.5 rounded-full">{userDemandes.length} nouvelle{userDemandes.length > 1 ? 's' : ''}</span>
              </div>
              {userDemandes.length > 0 ? (
                <div className="space-y-2">
                  {userDemandes.map(d => (
                    <Link key={d._key || d.id} href={`/ad/${d.id}`} className="block bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <ShoppingBag size={16} className="text-emerald-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">{d.title}</p>
                            {d.price != null && <p className="text-xs text-emerald-600 font-medium mt-0.5">{formatPrice(d.price)}</p>}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition shrink-0 ml-3">
                          Voir <ChevronRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 mb-3">
                    <ShoppingBag size={28} className="text-blue-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Aucune demande pour le moment</p>
                  <p className="text-xs text-slate-400 mt-1">Les demandes apparaîtront ici</p>
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
                  <span className="text-xs text-slate-400">Survolez une carte pour les actions</span>
                )}
              </div>
              {userServices.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userServices.map(ad => (
                    <div key={ad._key || ad.id} className="relative group/ad">
                      <AdCard ad={ad} />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/ad:opacity-100 transition-opacity z-20">
                        <Link href={`/create-ad?id=${ad.id}`} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title="Modifier">
                          <Edit3 size={14} className="text-slate-600" />
                        </Link>
                        <button onClick={() => setConfirmDelete(ad)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:shadow-md transition-all" title="Supprimer">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                        <button onClick={() => handleToggle(ad)} disabled={actionLoading === (ad._key || ad.id)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title={isAdActive(ad) ? 'Désactiver' : 'Activer'}>
                          {isAdActive(ad) ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} className="text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-50 mb-3">
                    <Wrench size={28} className="text-violet-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Vous n&apos;avez pas encore de service</p>
                  <p className="text-xs text-slate-400 mt-1">Proposez votre premier service aux clients</p>
                  <Link href="/create-ad" className="inline-flex items-center gap-1.5 mt-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    <PlusCircle size={16} /> Ajouter un service
                  </Link>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><ShoppingBag size={18} /> Demandes</h2>
              </div>
              {userDemandes.length > 0 ? (
                <div className="space-y-2">
                  {userDemandes.map(d => (
                    <Link key={d._key || d.id} href={`/ad/${d.id}`} className="block bg-white border border-slate-200 rounded-2xl p-4 hover:border-violet-200 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                            <Wrench size={16} className="text-violet-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">{d.title}</p>
                            {d.price != null && <p className="text-xs text-green-600 font-medium mt-0.5">{formatPrice(d.price)}</p>}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-xl hover:bg-violet-100 transition shrink-0 ml-3">
                          Voir <ChevronRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-white border border-dashed border-slate-200 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-50 mb-3">
                    <ShoppingBag size={28} className="text-violet-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Aucune demande pour le moment</p>
                  <p className="text-xs text-slate-400 mt-1">Les demandes de services apparaîtront ici</p>
                </div>
              )}
            </div>
          </>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Supprimer cette annonce ?</h3>
              <p className="text-sm text-slate-500 mb-6">Cette action est irréversible. L&apos;annonce sera définitivement supprimée.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-slate-200 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-all">Annuler</button>
                <button onClick={handleDelete} disabled={actionLoading} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={16} />}
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
