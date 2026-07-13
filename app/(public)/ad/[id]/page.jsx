'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { MapPin, User, Calendar, Heart, Flag, ImageIcon, ShoppingCart, Package, Scale, Tag, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'
import { useDispatch } from 'react-redux'
import { toggleFavorite } from '@/lib/features/favorites/favoritesSlice'
import { addItem } from '@/lib/features/cart/cartSlice'
import { fetchAdById } from '@/lib/supabase/queries'
import { supabase } from '@/lib/supabase/client'
import AdCard from '@/components/AdCard'
import Breadcrumb from '@/components/ad/Breadcrumb'
import SellerCard from '@/components/ad/SellerCard'
import SafetyTips from '@/components/ad/SafetyTips'
import ShareButtons from '@/components/ad/ShareButtons'
import PromoSidebar from '@/components/ads/PromoSidebar'
import toast from 'react-hot-toast'

function adTitle(ad) { return ad.title || ad.titre || ad.nom || '' }
function adPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function adImg(ad) { return ad.image_url || '' }
function adCommune(ad) { return ad._commune || ad.localite || '' }
function adDepartement(ad) { return ad._departement || ad.departement || '' }
function adVendeur(ad) { return ad._profile?.nom_complet || 'Particulier' }
function adCreated(ad) { return ad.created_at || ad.createdAt || '' }
function adRole(ad) { return ad._profile?.role || 'particulier' }
function adPhone(ad) { return ad._profile?.telephone || '' }

export default function AdDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const ads = useSelector(state => state.ads.list)
  const favIds = useSelector(state => state.favorites.ids)
  const [directAd, setDirectAd] = useState(null)
  const [fetching, setFetching] = useState(false)
  const adsLoaded = useSelector(state => !state.ads.loading)
  let ad = ads.find(a => a.id === id) || directAd
  const cat = ad ? getCategoryById(ad.category_id) : null
  const isFav = favIds.includes(id)
  const [userRole, setUserRole] = useState(null)
  const [sellerId, setSellerId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle().then(({ data }) => {
          if (data) setUserRole(data.role)
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!ads.find(a => a.id === id)) {
      setFetching(true)
      fetchAdById(id).then(setDirectAd).finally(() => setFetching(false))
    }
  }, [id, ads])

  useEffect(() => {
    if (!ad) return
    const contentType = ad.contentType || (ad.seller_id ? 'listing' : ad.vendeur_id ? 'product' : ad.prestataire_id ? 'service' : null)
    if (contentType) {
      fetch('/api/ads/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id, contentType }),
      }).catch(() => {})
    }
    setSellerId(ad._profile?.id || ad.seller_id || ad.vendeur_id || ad.prestataire_id || null)
  }, [ad])

  if (fetching || (!adsLoaded && !ad)) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 rounded w-48" />
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-80 bg-slate-200 rounded-xl" />
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={28} className="text-slate-300" />
        </div>
        <h1 className="text-xl text-slate-400 font-medium">Annonce introuvable</h1>
        <p className="text-sm text-slate-300 mt-1">Cette annonce n'existe plus ou a été supprimée.</p>
        <button onClick={() => router.push('/')} className="mt-6 text-sm text-agrishop-600 hover:underline font-medium">Retour à l'accueil</button>
      </div>
    )
  }

  const relatedAds = ads.filter(a => a.category_id === ad.category_id && a.id !== ad.id && a.status !== 'inactive').slice(0, 4)
  const isService = ad.contentType === 'service'
  const isProduct = ad.contentType === 'product'
  const commune = adCommune(ad)
  const departement = adDepartement(ad)
  const localisation = commune && departement ? `${commune} (${departement})` : commune || departement || 'Localisation non précisée'
  const price = adPrice(ad)
  const isPriceNegotiable = price === null || ad.prix_a_discuter === true
  const sellerName = adVendeur(ad)
  const keywords = [cat?.nom, ...adTitle(ad).split(/\s+/).filter(w => w.length > 3)].filter(Boolean).slice(0, 6)

  const characteristics = [
    ...(ad.quantite_disponible || ad.quantite ? [{ icon: Package, label: 'Quantité', value: ad.quantite_disponible || ad.quantite }] : []),
    ...(ad.conditionnement ? [{ icon: Scale, label: 'Conditionnement', value: ad.conditionnement }] : []),
    ...(ad.unite_mesure ? [{ icon: Tag, label: 'Unité', value: ad.unite_mesure }] : []),
    ...(ad.stock_actuel != null ? [{ icon: Package, label: 'Stock', value: ad.stock_actuel > 0 ? `${ad.stock_actuel} unités` : 'Sur commande' }] : []),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumb category={cat} title={adTitle(ad)} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="relative w-full h-80 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden group">
            {adImg(ad) ? (
              <Image src={adImg(ad)} alt={adTitle(ad)} width={800} height={400} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <ImageIcon size={48} className="mb-2" />
                <span className="text-sm">Pas d'image disponible</span>
              </div>
            )}
            <button
              onClick={() => dispatch(toggleFavorite(ad.id))}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow transition"
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
            </button>
            {isPriceNegotiable && (
              <span className="absolute top-3 left-3 text-xs font-medium bg-amber-500 text-white px-3 py-1 rounded-full shadow">
                Prix à discuter
              </span>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-tight">{adTitle(ad)}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {cat && <span className="inline-block text-xs font-medium text-agrishop-700 bg-agrishop-50 px-3 py-1 rounded-full">{cat.nom}</span>}
                  {isProduct && ad.stock_actuel > 0 && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                      Stock: {ad.stock_actuel}
                    </span>
                  )}
                  {isService && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                      {ad.type_service === 'prestation' ? 'Prestation' : 'Recherche prestataire'}
                    </span>
                  )}
                  {adRole(ad) === 'professionnel' && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-600">Pro</span>
                  )}
                </div>
              </div>
              <ShareButtons title={adTitle(ad)} id={ad.id} />
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-agrishop-600 mt-4">
              {isPriceNegotiable ? 'Prix à discuter' : formatPrice(price)}
              {ad.unite_mesure && !isPriceNegotiable && <span className="text-lg text-slate-400 font-normal"> / {ad.unite_mesure}</span>}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {localisation}</div>
              <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> {getRelativeTime(adCreated(ad))}</div>
              <div className="flex items-center gap-1.5"><User size={16} className="text-slate-400" /> {sellerName}</div>
            </div>
          </div>

          <hr />

          <div>
            <h2 className="font-semibold text-slate-700 mb-3">Description</h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{ad.description}</div>
          </div>

          {characteristics.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                <Package size={15} /> Caractéristiques
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characteristics.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-slate-100">
                      <Icon size={18} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400">{c.label}</p>
                        <p className="text-sm font-medium text-slate-700">{c.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <SellerCard ad={ad} sellerId={sellerId} />

            {!isService && (userRole === null || userRole === 'client') && (
              <button
                onClick={() => { dispatch(addItem({ id: ad.id, title: adTitle(ad), price: price })); toast.success('Ajouté au panier') }}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition text-sm"
              >
                <ShoppingCart size={16} /> Ajouter au panier
              </button>
            )}

            <div className="bg-white border rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
              <p className="flex justify-between">
                <span>Réf.</span>
                <span className="text-slate-500 font-mono">{String(ad.id).slice(0, 8)}</span>
              </p>
              {departement && (
                <p className="flex justify-between">
                  <span>Département</span>
                  <span className="text-slate-500">{departement}</span>
                </p>
              )}
              {ad.views > 0 && (
                <p className="flex justify-between">
                  <span>Vues</span>
                  <span className="text-slate-500">{ad.views}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => toast.success('Merci, notre équipe va examiner cette annonce.')}
              className="flex items-center justify-center gap-1.5 w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition py-2 rounded-lg"
            >
              <Flag size={14} /> Signaler cette annonce
            </button>

            <PromoSidebar role={userRole} />

            <SafetyTips />
          </div>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-slate-400 mb-2">Mots-clés associés</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <a
                key={i}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="text-xs text-slate-500 bg-slate-50 hover:bg-agrishop-50 hover:text-agrishop-600 px-3 py-1.5 rounded-full border border-slate-200 transition"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      )}

      {relatedAds.length > 0 && (
        <div className="mt-10 pt-8 border-t">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Annonces similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedAds.map(relatedAd => <AdCard key={relatedAd._key || relatedAd.id} ad={relatedAd} />)}
          </div>
        </div>
      )}
    </div>
  )
}
