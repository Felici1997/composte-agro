'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ChevronDown, PlusCircle, ArrowRight } from 'lucide-react'
import { categories, regions } from '@/lib/categories'

export default function SearchBanner() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('cat', category)
    if (region) params.set('region', region)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section data-joyride="hero-search" className="relative overflow-hidden bg-gradient-to-br from-agrishop-800 via-agrishop-700 to-emerald-800 rounded-2xl p-6 sm:p-10 text-white mt-4 shadow-lg min-h-[420px] flex items-center">
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-agrishop-900/90 via-agrishop-800/80 to-emerald-900/80" />
      </div>
      <div className="relative z-10 w-full">
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
          <Search size={12} /> Plateforme agricole n°1 au Congo
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">Le marché agricole <br className="hidden sm:block" />de proximité</h1>
        <p className="text-agrishop-100 text-sm sm:text-base mb-6 max-w-xl">
          Trouvez matériel, animaux, semences, terrains et services agricoles près de chez vous. Publiez gratuitement.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Que cherchez-vous ? (tracteur, semences...)"
              className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-800 text-sm bg-white outline-none"
              data-joyride="hero-search-input"
            />
          </div>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-lg text-slate-800 text-sm bg-white outline-none cursor-pointer"
            >
              <option value="">Toute catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-lg text-slate-800 text-sm bg-white outline-none cursor-pointer"
            >
              <option value="">Toute région</option>
              {regions.map(r => <option key={r.nom} value={r.nom}>{r.nom}</option>)}
            </select>
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button type="submit" className="bg-white text-agrishop-700 font-semibold px-8 py-3 rounded-lg hover:bg-agrishop-50 transition text-sm border border-agrishop-200 shadow-sm">
            Rechercher
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-lg">
            <PlusCircle size={16} /> Publier une annonce
          </Link>
          <Link href="/search" className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-white/25 transition">
            Explorer les annonces <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
