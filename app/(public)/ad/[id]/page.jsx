'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { MapPin, User, Calendar, Heart, Flag, ImageIcon, Package, Scale, Tag, ChevronLeft, ChevronRight, BadgeCheck, Clock, Eye } from 'lucide-react'
import Image from 'next/image'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'
import { useDispatch } from 'react-redux'
import { toggleFavorite } from '@/lib/features/favorites/favoritesSlice'
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
function adImages(ad) { return ad.images?.length > 0 ? ad.images : (ad.image_url ? [ad.image_url] : []) }
function adCommune(ad) { return ad._commune || ad.localite || '' }
function adDepartement(ad) { return ad._departement || ad.departement || '' }
function adVendeur(ad) { return ad._profile?.nom_complet || 'Particulier' }
function adCreated(ad) { return ad.created_at || ad.createdAt || '' }
function adRole(ad) { return ad._profile?.role || 'particulier' }

export default function AdDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const ads = useSelector(state => state.ads.list)
  const favIds = useSelector(state => state.favorites.ids)
  const [directAd, setDirectAd] = useState(null)
  const [fetching, setFetching] = useState(false)
  const adsLoaded = useSelector(state => !state.ads.loading || state.ads.loaded)
  let ad = ads.find(a => a.id === id) || directAd
  const cat = ad ? getCategoryById(ad.category_id) : null
  const isFav = favIds.includes(id)
  const [userRole, setUserRole] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [sellerId, setSellerId] = useState(null)
  const isOwner = currentUserId && sellerId && currentUserId === sellerId
  const isAdmin = userRole === 'admin'
  const canSeeViews = isOwner || isAdmin
  const [imgIndex, setImgIndex] = useState(0)
  const allImages = ad ? adImages(ad) : []
  const currentImg = allImages[imgIndex] || ''

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUserId(session.user.id)
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
    const contentType = ad.contentType || (ad.client_id ? 'listing' : ad.vendeur_id ? 'product' : ad.prestataire_id ? 'service' : null)
    if (contentType) {
      fetch('/api/ads/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id, contentType }),
      }).catch(() => {})
    }
    setSellerId(ad._profile?.id || ad.client_id || ad.vendeur_id || ad.prestataire_id || null)
  }, [ad])

  if (fetching || (!adsLoaded && !ad)) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 rounded w-48" />
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
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
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin size={28} className="text-slate-300" />
        </div>
        <h1 className="text-xl text-slate-500 font-medium">Annonce introuvable</h1>
        <p className="text-sm text-slate-400 mt-1">Cette annonce n&apos;existe plus ou a été supprimée.</p>
        <button onClick={() => router.push('/')} className="mt-6 text-sm text-agrishop-700 hover:underline font-medium">Retour à l&apos;accueil</button>
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
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* Image Gallery */}
          <div className="relative bg-slate-50 rounded-2xl overflow-hidden group border border-slate-100">
            <div className="relative h-80 sm:h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
              {currentImg ? (
                <Image src={currentImg} alt={adTitle(ad)} width={800} height={500} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <ImageIcon size={36} />
                  </div>
                  <span className="text-sm font-medium">Pas d&apos;image disponible</span>
                </div>
              )}

              {allImages.length > 1 && (
                <>
                  <button type="button" onClick={() => setImgIndex(i => i > 0 ? i - 1 : allImages.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-105">
                    <ChevronLeft size={20} className="text-slate-700" />
                  </button>
                  <button type="button" onClick={() => setImgIndex(i => i < allImages.length - 1 ? i + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-105">
                    <ChevronRight size={20} className="text-slate-700" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                    {imgIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
                {allImages.map((img, i) => (
                  <button key={i} type="button" onClick={() => setImgIndex(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIndex ? 'border-agrishop-600 shadow-md ring-1 ring-agrishop-200' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => dispatch(toggleFavorite(ad.id))}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-lg transition-all hover:scale-105 z-10"
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={19} className={isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
            </button>

            {isPriceNegotiable && (
              <span className="absolute top-4 left-4 text-xs font-semibold bg-amber-500 text-white px-3.5 py-1.5 rounded-full shadow-lg z-10">
                Prix à discuter
              </span>
            )}
          </div>

          {/* Title & Meta */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{adTitle(ad)}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {cat && <span className="inline-block text-xs font-medium text-agrishop-700 bg-agrishop-50 border border-agrishop-200 px-3 py-1 rounded-full">{cat.nom}</span>}
                  {isProduct && ad.stock_actuel > 0 && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      Stock: {ad.stock_actuel}
                    </span>
                  )}
                  {isService && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                      {ad.type_service === 'prestation' ? 'Prestation' : 'Recherche prestataire'}
                    </span>
                  )}
                  {adRole(ad) === 'professionnel' && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-200">Pro</span>
                  )}
                </div>
              </div>
              <div className="hidden sm:block">
                <ShareButtons title={adTitle(ad)} id={ad.id} />
              </div>
            </div>

            {/* Price */}
            <div className="bg-agrishop-50 rounded-xl px-5 py-4 border border-agrishop-100">
              <p className="text-xs text-agrishop-600 font-medium mb-0.5">Prix</p>
              <p className="text-2xl sm:text-3xl font-bold text-agrishop-800">
                {isPriceNegotiable ? 'Prix à discuter' : formatPrice(price)}
                {ad.unite_mesure && !isPriceNegotiable && <span className="text-base text-agrishop-600 font-normal"> / {ad.unite_mesure}</span>}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" /> {localisation}</div>
              <div className="flex items-center gap-1.5"><Clock size={15} className="text-slate-400" /> {getRelativeTime(adCreated(ad))}</div>
              <div className="flex items-center gap-1.5"><User size={15} className="text-slate-400" /> {sellerName}</div>
              {canSeeViews && <div className="flex items-center gap-1.5"><Eye size={15} className="text-slate-400" /> {ad.views ?? 0} vues</div>}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-agrishop-500" />
              Description
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {ad.description || 'Aucune description fournie.'}
            </div>
          </div>

          {/* Characteristics */}
          {characteristics.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-agrishop-500" />
                Caractéristiques
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characteristics.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100 hover:border-agrishop-200 transition">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon size={18} className="text-agrishop-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{c.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{c.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mobile Share */}
          <div className="sm:hidden">
            <ShareButtons title={adTitle(ad)} id={ad.id} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <SellerCard ad={ad} sellerId={sellerId} />

            {/* Meta card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-500">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-400">Référence</span>
                <span className="text-slate-700 font-mono font-medium">#{String(ad.id).slice(0, 8)}</span>
              </div>
              {departement && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Département</span>
                  <span className="text-slate-700 font-medium">{departement}</span>
                </div>
              )}
              {canSeeViews && <div className="flex items-center justify-between">
                <span className="text-slate-400">Vues</span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Eye size={13} className="text-slate-400" /> {ad.views ?? 0}
                </span>
              </div>}
              {adCreated(ad) && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Publiée</span>
                  <span className="text-slate-700 font-medium">{getRelativeTime(adCreated(ad))}</span>
                </div>
              )}
            </div>

            {/* Report */}
            <button
              onClick={() => toast.success('Merci, notre équipe va examiner cette annonce.')}
              className="flex items-center justify-center gap-2 w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition py-3 rounded-2xl border border-red-100 hover:border-red-200"
            >
              <Flag size={14} /> Signaler cette annonce
            </button>

            <PromoSidebar role={userRole} />
            <SafetyTips />
          </div>
        </div>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 font-medium mb-3">Mots-clés</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <a key={i} href={`/search?q=${encodeURIComponent(kw)}`}
                className="text-xs text-slate-500 bg-slate-50 hover:bg-agrishop-50 hover:text-agrishop-700 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-agrishop-200 transition">
                {kw}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related Ads */}
      {relatedAds.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-0.5">Annonces similaires</h2>
              <p className="text-sm text-slate-500">Vous pourriez aussi être intéressé</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedAds.map(relatedAd => <AdCard key={relatedAd._key || relatedAd.id} ad={relatedAd} />)}
          </div>
        </div>
      )}
    </div>
  )
}