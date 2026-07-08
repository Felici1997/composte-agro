'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { MapPin, User, Calendar, Phone, MessageCircle, ArrowLeft, Heart, Flag, ImageIcon, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'
import { useDispatch } from 'react-redux'
import { toggleFavorite } from '@/lib/features/favorites/favoritesSlice'
import { addItem } from '@/lib/features/cart/cartSlice'
import { fetchAdById } from '@/lib/supabase/queries'
import AdCard from '@/components/AdCard'
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

  useEffect(() => {
    if (!ads.find(a => a.id === id)) {
      setFetching(true)
      fetchAdById(id).then(setDirectAd).finally(() => setFetching(false))
    }
  }, [id, ads])

  if (fetching || (!adsLoaded && !ad)) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse space-y-6">
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
        <p className="text-sm text-slate-300 mt-1">Cette annonce n'existe plus ou a ├®t├® supprim├®e.</p>
        <button onClick={() => router.push('/')} className="mt-6 text-sm text-agrishop-600 hover:underline font-medium">Retour ├á l'accueil</button>
      </div>
    )
  }

  const relatedAds = ads.filter(a => a.category_id === ad.category_id && a.id !== ad.id && a.status !== 'inactive').slice(0, 4)
  const isService = ad.contentType === 'service'
  const isProduct = ad.contentType === 'product'
  const commune = adCommune(ad)
  const departement = adDepartement(ad)
  const localisation = commune && departement ? `${commune} (${departement})` : commune || departement || 'Localisation non pr├®cis├®e'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-4 transition">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="w-full h-80 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
            {adImg(ad) ? (
              <Image src={adImg(ad)} alt={adTitle(ad)} width={800} height={400} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <ImageIcon size={48} className="mb-2" />
                <span className="text-sm">Pas d'image disponible</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-tight">{adTitle(ad)}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {cat && <span className="inline-block text-xs font-medium text-agrishop-700 bg-agrishop-50 px-3 py-1 rounded-full">{cat.nom}</span>}
                  {isProduct && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                      {ad.stock_actuel > 0 ? `Stock: ${ad.stock_actuel}` : 'Sur commande'}
                    </span>
                  )}
                  {isService && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                      {ad.type_service === 'prestation' ? 'Prestation' : 'Recherche prestataire'}
                    </span>
                  )}
                  {adRole(ad) === 'professionnel' && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">Pro</span>
                  )}
                </div>
              </div>
              <button onClick={() => dispatch(toggleFavorite(ad.id))} className="shrink-0 p-2 rounded-full hover:bg-slate-100 transition" aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <Heart size={22} className={isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
              </button>
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-agrishop-600 mt-4">
              {formatPrice(adPrice(ad))}
              {ad.unite_mesure && <span className="text-lg text-slate-400 font-normal"> / {ad.unite_mesure}</span>}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {localisation}</div>
              <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> {getRelativeTime(adCreated(ad))}</div>
              <div className="flex items-center gap-1.5"><User size={16} className="text-slate-400" /> {adVendeur(ad)}</div>
            </div>
          </div>

          <hr />

          <div>
            <h2 className="font-semibold text-slate-700 mb-3">Description</h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{ad.description}</div>
          </div>

          {isProduct && ad.conditionnement && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm">
              <p className="text-slate-500"><span className="font-medium text-slate-700">Conditionnement :</span> {ad.conditionnement}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-slate-700">Contact</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-agrishop-100 text-agrishop-700 rounded-full flex items-center justify-center text-lg font-semibold">
                  {adVendeur(ad)[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{adVendeur(ad)}</p>
                  <p className="text-xs text-slate-400">{adRole(ad) === 'professionnel' ? 'Professionnel' : 'Particulier'}</p>
                </div>
              </div>

              <div className="space-y-2">
                {adPhone(ad) && (
                  <a href={`tel:${adPhone(ad)}`} className="flex items-center justify-center gap-2 w-full bg-agrishop-600 hover:bg-agrishop-700 text-white font-medium py-3 rounded-lg transition text-sm">
                    <Phone size={16} /> Appeler ÔÇö {adPhone(ad)}
                  </a>
                )}
                <button onClick={() => toast.success('Messagerie bient├┤t disponible')} className="flex items-center justify-center gap-2 w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition text-sm">
                  <MessageCircle size={16} /> Message
                </button>
                {!isService && (
                  <button onClick={() => { dispatch(addItem({ id: ad.id, title: adTitle(ad), price: adPrice(ad) })); toast.success('Ajout├® au panier') }} className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition text-sm">
                    <ShoppingCart size={16} /> Ajouter au panier
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 text-center">Annonce publiée {getRelativeTime(adCreated(ad))}</p>
            </div>

            <div className="bg-white border rounded-xl p-4 text-xs text-slate-400 space-y-1">
              <p className="flex justify-between"><span>Réf.</span><span className="text-slate-500 font-mono">{String(ad.id).slice(0, 8)}</span></p>
              {departement && <p className="flex justify-between"><span>Département</span><span className="text-slate-500">{departement}</span></p>}
            </div>

            <button onClick={() => toast.success('Merci, notre équipe va examiner cette annonce.')} className="flex items-center justify-center gap-1.5 w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition py-2 rounded-lg">
              <Flag size={14} /> Signaler cette annonce
            </button>
          </div>
        </div>
      </div>

      {relatedAds.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Annonces similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedAds.map(relatedAd => <AdCard key={relatedAd._key || relatedAd.id} ad={relatedAd} />)}
          </div>
        </div>
      )}
    </div>
  )
}
