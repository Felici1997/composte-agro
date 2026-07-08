'use client'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import AdCard from '@/components/AdCard'

export default function FavoritesPage() {
  const ads = useSelector(state => state.ads.list)
  const favIds = useSelector(state => state.favorites.ids)
  const favAds = ads.filter(a => favIds.includes(a.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-700 mb-1">Mes favoris</h1>
      <p className="text-sm text-slate-400 mb-6">{favAds.length} annonce{favAds.length > 1 ? 's' : ''}</p>

      {favAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 font-medium">Aucun favori</p>
          <p className="text-sm text-slate-300 mt-1">Ajoutez des annonces en favoris en cliquant sur le cœur</p>
          <Link href="/" className="inline-block mt-4 text-sm text-agrishop-600 hover:underline">Découvrir les annonces</Link>
        </div>
      )}
    </div>
  )
}
