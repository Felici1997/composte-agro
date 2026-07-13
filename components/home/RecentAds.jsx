'use client'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import AdCard from '@/components/AdCard'
import FeaturedAds from '@/components/ads/FeaturedAds'
import { loadAds } from '@/lib/features/ads/adsSlice'

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RecentAds() {
  const dispatch = useDispatch()
  const { list: ads, loading, error } = useSelector(state => state.ads)
  const activeAds = ads.filter(a => a.status === 'disponible' || a.is_active || a.est_disponible).slice(0, 8)
  const [stuck, setStuck] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (loading && activeAds.length === 0) {
      timerRef.current = setTimeout(() => setStuck(true), 15000)
    } else {
      setStuck(false)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [loading, activeAds.length])

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-700">Annonces récentes</h2>
        <Link href="/search" className="text-sm text-agrishop-600 hover:text-agrishop-700 font-medium hover:underline transition">
          Voir tout →
        </Link>
      </div>
      <FeaturedAds ads={activeAds} />

      {loading && activeAds.length === 0 && !stuck ? (
        <SkeletonCards />
      ) : stuck ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-500">Le chargement prend plus de temps que prévu</p>
          <p className="text-xs mt-1">Vérifiez votre connexion internet</p>
          <button
            onClick={() => { setStuck(false); dispatch(loadAds()) }}
            className="mt-4 inline-flex items-center gap-1.5 bg-agrishop-600 hover:bg-agrishop-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      ) : activeAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeAds.map((ad) => (
            <AdCard key={ad._key || ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">Aucune annonce pour le moment</p>
          <p className="text-xs mt-1">
            {error ? `Erreur de chargement : vérifie la connexion` : 'Soyez le premier à publier !'}
          </p>
        </div>
      )}
    </section>
  )
}
