'use client'
import { Heart, MapPin, User, ImageIcon, Eye, ClipboardList, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '@/lib/features/favorites/favoritesSlice'

function getAdTitle(ad) { return ad.title || ad.titre || ad.nom || '' }
function getAdPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function getAdImg(ad) { return ad.images?.[0] || ad.image_url || '' }
function getAdCommune(ad) { return ad._commune || ad.localite || '' }
function getAdDepartement(ad) { return ad._departement || ad.departement || '' }
function getAdVendeur(ad) { return ad._profile?.nom_complet || 'Particulier' }
function getAdCreated(ad) { return ad.created_at || ad.createdAt || '' }

const AdCard = ({ ad }) => {
  const dispatch = useDispatch()
  const favIds = useSelector(state => state.favorites.ids)
  const isFav = favIds.includes(ad.id)
  const cat = getCategoryById(ad.category_id)

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative">
        <Link href={`/ad/${ad.id}`}>
          <div className="ad-card-img bg-slate-100 overflow-hidden relative">
            {getAdImg(ad) ? (
              <Image src={getAdImg(ad)} alt={getAdTitle(ad)} width={400} height={300} className="w-full h-full object-cover group-hover:scale-[1.08] transition duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                <ImageIcon size={36} className="mb-1.5" />
                <span className="text-xs font-medium">Pas d&apos;image</span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[75%]">
          {(ad.sponsored || ad.featured) && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100/90 backdrop-blur-sm border border-amber-200/50 px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles size={10} className="shrink-0" /> Sponsorisé
            </span>
          )}
          {ad.contentType === 'listing' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-0.5 rounded-full shadow-sm">
              <ClipboardList size={10} /> Client
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleFavorite(ad.id)) }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm hover:shadow-md z-10"
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
        </button>

        {cat && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {cat.nom}
            </span>
          </div>
        )}
      </div>

      <Link href={`/ad/${ad.id}`} className="block p-4">
        <p className="text-base font-bold text-agrishop-700 truncate">{formatPrice(getAdPrice(ad))}</p>
        {ad.unite_mesure && <p className="text-[10px] text-slate-400">/ {ad.unite_mesure}</p>}
        <h3 className="text-sm text-slate-800 font-medium mt-1 line-clamp-2 leading-snug break-words">{getAdTitle(ad)}</h3>

        <div className="flex items-center gap-1 mt-2.5 text-xs text-slate-400">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{getAdCommune(ad) || getAdDepartement(ad) || 'Localisation non précisée'}</span>
        </div>

        <div className="flex items-center justify-between mt-2.5 gap-2 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <User size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{getAdVendeur(ad)}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(ad.views ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                <Eye size={11} className="shrink-0" /> {ad.views}
              </span>
            )}
            <span className="text-[11px] text-slate-400">{getRelativeTime(getAdCreated(ad))}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default AdCard