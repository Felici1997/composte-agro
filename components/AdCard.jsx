'use client'
import { Heart, MapPin, User, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '@/lib/features/favorites/favoritesSlice'

function getAdTitle(ad) { return ad.title || ad.titre || ad.nom || '' }
function getAdPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function getAdImg(ad) { return ad.image_url || '' }
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
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-agrishop-200 transition-all duration-200">
      <div className="relative">
        <Link href={`/ad/${ad.id}`}>
          <div className="ad-card-img bg-slate-100 overflow-hidden relative">
            {getAdImg(ad) ? (
              <Image src={getAdImg(ad)} alt={getAdTitle(ad)} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                <ImageIcon size={32} className="mb-1" />
                <span className="text-xs font-medium">Pas d'image</span>
              </div>
            )}
          </div>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleFavorite(ad.id)) }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition shadow-sm"
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} className={isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
        </button>
      </div>
      <Link href={`/ad/${ad.id}`} className="block p-3">
        <p className="text-sm font-bold text-agrishop-600">{formatPrice(getAdPrice(ad))}</p>
        {ad.unite_mesure && <p className="text-[10px] text-slate-400">/ {ad.unite_mesure}</p>}
        <h3 className="text-sm text-slate-800 font-medium mt-0.5 line-clamp-2 leading-snug">{getAdTitle(ad)}</h3>
        {cat && <p className="text-xs text-slate-400 mt-1">{cat.nom}</p>}
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
          <MapPin size={12} />
          <span className="truncate">{getAdCommune(ad) || getAdDepartement(ad) || 'Localisation non précisée'}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <User size={12} />
            <span className="truncate">{getAdVendeur(ad)}</span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">{getRelativeTime(getAdCreated(ad))}</span>
        </div>
      </Link>
    </div>
  )
}

export default AdCard
