'use client'
import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { categories, regions } from '@/lib/categories'

function getAdTitle(ad) { return (ad.title || ad.titre || ad.nom || '').toLowerCase() }
function getAdDesc(ad) { return (ad.description || '').toLowerCase() }
function getAdPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function getAdRegion(ad) { return ad._departement || ad.departement || '' }

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const allAds = useSelector(state => state.ads.list)

  const q = searchParams.get('q') || ''
  const catFilter = searchParams.get('cat') || ''
  const regionFilter = searchParams.get('region') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sort') || 'date_desc'

  const [showFilters, setShowFilters] = useState(false)
  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  useEffect(() => {
    const t = setTimeout(() => {
      if (localMin !== minPrice) updateFilter('minPrice', localMin)
    }, 500)
    return () => clearTimeout(t)
  }, [localMin])

  useEffect(() => {
    const t = setTimeout(() => {
      if (localMax !== maxPrice) updateFilter('maxPrice', localMax)
    }, 500)
    return () => clearTimeout(t)
  }, [localMax])

  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/search?${params.toString()}`)
  }, [searchParams, router])

  const clearFilters = () => router.push('/search')

  let filteredAds = allAds.filter(ad => {
    if (ad.status === 'inactive' || ad.is_active === false || ad.est_disponible === false) return false
    const adTitle = getAdTitle(ad)
    const adDesc = getAdDesc(ad)
    if (q && !adTitle.includes(q.toLowerCase()) && !adDesc.includes(q.toLowerCase())) return false
    if (catFilter && ad.category_id !== parseInt(catFilter)) return false
    if (regionFilter && getAdRegion(ad) !== regionFilter) return false
    const p = getAdPrice(ad)
    if (minPrice && p !== null && p < parseFloat(minPrice)) return false
    if (maxPrice && p !== null && p > parseFloat(maxPrice)) return false
    return true
  })

  switch (sortBy) {
    case 'price_asc': filteredAds.sort((a, b) => (getAdPrice(a) || 0) - (getAdPrice(b) || 0)); break
    case 'price_desc': filteredAds.sort((a, b) => (getAdPrice(b) || 0) - (getAdPrice(a) || 0)); break
    default: filteredAds.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)); break
  }

  const hasFilters = catFilter || regionFilter || minPrice || maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start gap-8">
        <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40 flex' : 'hidden'} lg:relative lg:flex lg:w-64 shrink-0`}>
          <div className={`${showFilters ? 'w-80 bg-white h-full overflow-y-auto p-6' : 'w-full'} lg:bg-white lg:border lg:rounded-xl lg:p-4 lg:sticky lg:top-24 space-y-4`}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="font-semibold text-slate-700">Filtres</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-1.5"><SlidersHorizontal size={15} /> Filtres</h3>
              {hasFilters && <button onClick={clearFilters} className="text-xs text-composte-600 hover:underline">Tout effacer</button>}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</label>
              <select value={catFilter} onChange={e => updateFilter('cat', e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-composte-400 bg-white">
                <option value="">Toutes les catégories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Département</label>
              <select value={regionFilter} onChange={e => updateFilter('region', e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-composte-400 bg-white">
                <option value="">Tous les départements</option>
                {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</label>
              <div className="flex items-center gap-2 mt-1.5">
                <input type="number" placeholder="Min" value={localMin} onChange={e => setLocalMin(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-composte-400" />
                <span className="text-slate-300">-</span>
                <input type="number" placeholder="Max" value={localMax} onChange={e => setLocalMax(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-composte-400" />
              </div>
            </div>

            {showFilters && (
              <button onClick={() => setShowFilters(false)} className="w-full bg-composte-600 text-white py-2.5 rounded-lg text-sm font-medium lg:hidden">
                Voir les résultats ({filteredAds.length})
              </button>
            )}
          </div>
          {showFilters && <div className="flex-1" onClick={() => setShowFilters(false)} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-700">
                {q ? <>Résultats pour "<span className="text-composte-600">{q}</span>"</> : 'Toutes les annonces'}
              </h1>
              <p className="text-sm text-slate-400">{filteredAds.length} annonce{filteredAds.length > 1 ? 's' : ''} trouvée{filteredAds.length > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-1.5 text-sm text-slate-500 border px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                <SlidersHorizontal size={16} /> Filtres
              </button>
              <select value={sortBy} onChange={e => updateFilter('sort', e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-composte-400 bg-white">
                <option value="date_desc">Plus récentes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {catFilter && <span className="inline-flex items-center gap-1 text-xs bg-composte-50 text-composte-700 px-3 py-1 rounded-full font-medium">{categories.find(c => c.id === parseInt(catFilter))?.nom} <X size={12} className="cursor-pointer" onClick={() => updateFilter('cat', '')} /></span>}
              {regionFilter && <span className="inline-flex items-center gap-1 text-xs bg-composte-50 text-composte-700 px-3 py-1 rounded-full font-medium">{regionFilter} <X size={12} className="cursor-pointer" onClick={() => updateFilter('region', '')} /></span>}
              {minPrice && <span className="inline-flex items-center gap-1 text-xs bg-composte-50 text-composte-700 px-3 py-1 rounded-full font-medium">Min: {parseInt(minPrice).toLocaleString('fr-FR')} FCFA <X size={12} className="cursor-pointer" onClick={() => { setLocalMin(''); updateFilter('minPrice', '') }} /></span>}
              {maxPrice && <span className="inline-flex items-center gap-1 text-xs bg-composte-50 text-composte-700 px-3 py-1 rounded-full font-medium">Max: {parseInt(maxPrice).toLocaleString('fr-FR')} FCFA <X size={12} className="cursor-pointer" onClick={() => { setLocalMax(''); updateFilter('maxPrice', '') }} /></span>}
            </div>
          )}

          {filteredAds.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl">
              <Search size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-lg font-medium">Aucune annonce trouvée</p>
              <p className="text-slate-300 text-sm mt-1">Essayez de modifier vos filtres ou d'élargir votre recherche</p>
              {hasFilters && <button onClick={clearFilters} className="mt-4 text-sm text-composte-600 hover:underline font-medium">Effacer tous les filtres</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
