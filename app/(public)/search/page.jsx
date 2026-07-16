'use client'
import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Search, SlidersHorizontal, X, ClipboardList, Package, Wrench } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { categories, regions } from '@/lib/categories'

function getAdTitle(ad) { return (ad.title || ad.titre || ad.nom || '').toLowerCase() }
function getAdDesc(ad) { return (ad.description || '').toLowerCase() }
function getAdPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function getAdRegion(ad) { return ad._departement || ad.departement || '' }

const typeOptions = [
  { value: '', label: 'Tout', icon: null },
  { value: 'listing', label: 'Clients', icon: ClipboardList },
  { value: 'product', label: 'Producteurs', icon: Package },
  { value: 'service', label: 'Services', icon: Wrench },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { list: allAds, loading: adsLoading } = useSelector(state => state.ads)

  const q = searchParams.get('q') || ''
  const catFilter = searchParams.get('cat') || ''
  const regionFilter = searchParams.get('region') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sort') || 'date_desc'
  const typeFilter = searchParams.get('type') || ''

  const [mounted, setMounted] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  useEffect(() => { setMounted(true) }, [])

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
    if (typeFilter && ad.contentType !== typeFilter) return false
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

  const hasFilters = catFilter || regionFilter || minPrice || maxPrice || typeFilter

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start gap-8">
        <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40 flex' : 'hidden'} lg:relative lg:flex lg:w-64 shrink-0`}>
          <div className={`${showFilters ? 'w-full max-w-sm bg-white h-full overflow-y-auto p-6' : 'w-full'} lg:bg-white lg:border lg:rounded-xl lg:p-4 lg:sticky lg:top-24 space-y-4`}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="font-semibold text-slate-700">Filtres</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-1.5"><SlidersHorizontal size={15} /> Filtres</h3>
              {hasFilters && <button onClick={clearFilters} className="text-xs text-agrishop-600 hover:underline">Tout effacer</button>}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</label>
              <div className="flex gap-1 mt-1.5 bg-slate-100 rounded-lg p-0.5 overflow-x-auto no-scrollbar">
                {typeOptions.map(opt => {
                  const Icon = opt.icon
                  const active = (typeFilter || '') === opt.value
                  return (
                    <button key={opt.value} onClick={() => updateFilter('type', opt.value)}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-2 rounded-md transition whitespace-nowrap ${active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {Icon && <Icon size={13} className="shrink-0" />} {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</label>
              <select value={catFilter} onChange={e => updateFilter('cat', e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 bg-white">
                <option value="">Toutes les catégories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Département</label>
              <select value={regionFilter} onChange={e => updateFilter('region', e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 bg-white">
                <option value="">Tous les départements</option>
                {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</label>
              <div className="flex items-center gap-2 mt-1.5">
                <input type="number" inputMode="numeric" placeholder="Min" value={localMin} onChange={e => setLocalMin(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                <span className="text-slate-300 shrink-0">-</span>
                <input type="number" inputMode="numeric" placeholder="Max" value={localMax} onChange={e => setLocalMax(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              </div>
            </div>

            {showFilters && (
              <button onClick={() => setShowFilters(false)} className="w-full bg-agrishop-600 text-white py-2.5 rounded-lg text-sm font-medium lg:hidden">
                Voir les résultats ({mounted ? filteredAds.length : 0})
              </button>
            )}
          </div>
          {showFilters && <div className="flex-1" onClick={() => setShowFilters(false)} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-700 truncate">
                {q ? <>Résultats pour "<span className="text-agrishop-600 break-all">{q}</span>"</> : 'Toutes les annonces'}
              </h1>
              <p className="text-sm text-slate-400">{mounted ? filteredAds.length : '—'} résultat{filteredAds.length > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex gap-1 bg-slate-100 rounded-lg p-0.5 overflow-x-auto no-scrollbar">
                {typeOptions.map(opt => {
                  const Icon = opt.icon
                  const active = (typeFilter || '') === opt.value
                  return (
                    <button key={opt.value} onClick={() => updateFilter('type', opt.value)}
                      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md transition whitespace-nowrap ${active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {Icon && <Icon size={14} className="shrink-0" />} {opt.label}
                    </button>
                  )
                })}
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-1.5 text-sm text-slate-500 border px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                <SlidersHorizontal size={16} /> Filtres
              </button>
              <select value={sortBy} onChange={e => updateFilter('sort', e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-agrishop-400 bg-white">
                <option value="date_desc">Plus récentes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {typeFilter && <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{typeFilter === 'listing' ? 'Clients' : typeFilter === 'product' ? 'Producteurs' : 'Services'} <X size={12} className="cursor-pointer" onClick={() => updateFilter('type', '')} /></span>}
              {catFilter && <span className="inline-flex items-center gap-1 text-xs bg-agrishop-50 text-agrishop-700 px-3 py-1 rounded-full font-medium">{categories.find(c => c.id === parseInt(catFilter))?.nom} <X size={12} className="cursor-pointer" onClick={() => updateFilter('cat', '')} /></span>}
              {regionFilter && <span className="inline-flex items-center gap-1 text-xs bg-agrishop-50 text-agrishop-700 px-3 py-1 rounded-full font-medium">{regionFilter} <X size={12} className="cursor-pointer" onClick={() => updateFilter('region', '')} /></span>}
              {minPrice && <span className="inline-flex items-center gap-1 text-xs bg-agrishop-50 text-agrishop-700 px-3 py-1 rounded-full font-medium">Min: {parseInt(minPrice).toLocaleString('fr-FR')} FCFA <X size={12} className="cursor-pointer" onClick={() => { setLocalMin(''); updateFilter('minPrice', '') }} /></span>}
              {maxPrice && <span className="inline-flex items-center gap-1 text-xs bg-agrishop-50 text-agrishop-700 px-3 py-1 rounded-full font-medium">Max: {parseInt(maxPrice).toLocaleString('fr-FR')} FCFA <X size={12} className="cursor-pointer" onClick={() => { setLocalMax(''); updateFilter('maxPrice', '') }} /></span>}
            </div>
          )}

          {!mounted || (adsLoading && filteredAds.length === 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : filteredAds.length > 0 ? (
            typeFilter === 'listing' || (!typeFilter && filteredAds.every(a => a.contentType === 'listing')) ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
              </div>
            ) : typeFilter === 'product' || (!typeFilter && filteredAds.every(a => a.contentType === 'product')) ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
              </div>
            ) : typeFilter === 'service' || (!typeFilter && filteredAds.every(a => a.contentType === 'service')) ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAds.some(a => a.contentType === 'listing') && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList size={16} className="text-blue-500" />
                      <h2 className="text-sm font-semibold text-slate-600">Clients</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredAds.filter(a => a.contentType === 'listing').map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
                    </div>
                  </div>
                )}
                {filteredAds.some(a => a.contentType === 'product') && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={16} className="text-agrishop-600" />
                      <h2 className="text-sm font-semibold text-slate-600">Producteurs</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredAds.filter(a => a.contentType === 'product').map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
                    </div>
                  </div>
                )}
                {filteredAds.some(a => a.contentType === 'service') && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench size={16} className="text-amber-600" />
                      <h2 className="text-sm font-semibold text-slate-600">Services</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredAds.filter(a => a.contentType === 'service').map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-lg font-medium">Aucune annonce trouvée</p>
              <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Essayez de modifier vos filtres ou d'élargir votre recherche</p>
              {hasFilters && <button onClick={clearFilters} className="mt-5 text-sm bg-agrishop-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-agrishop-700 transition shadow-sm">Effacer tous les filtres</button>}
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
