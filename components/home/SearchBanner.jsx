'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ChevronDown, PlusCircle, ArrowRight, Leaf } from 'lucide-react'
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
    <section data-joyride="hero-search" className="relative overflow-hidden bg-gradient-to-br from-agrishop-900 via-agrishop-800 to-earth-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white mt-6 shadow-xl min-h-[520px] flex items-center">
      <div className="absolute inset-0">
        <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-agrishop-950/90 via-agrishop-900/80 to-earth-950/70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-agrishop-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium mb-5 border border-white/10 animate-fade-in-up">
          <Leaf size={14} className="text-emerald-300" />
          Plateforme agricole n°1 au Congo
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Le marché agricole <br className="hidden sm:block" />
          <span className="text-gradient bg-gradient-to-r from-emerald-300 to-agrishop-300">de proximité</span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Trouvez matériel, animaux, semences, terrains et services agricoles près de chez vous. Publiez gratuitement.
        </p>

        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Que cherchez-vous ? (tracteur, semences...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-800 text-sm bg-white outline-none shadow-sm"
                data-joyride="hero-search-input"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="appearance-none w-full sm:w-44 pl-4 pr-10 py-3.5 rounded-xl text-slate-800 text-sm bg-white outline-none cursor-pointer shadow-sm"
              >
                <option value="">Toute catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="appearance-none w-full sm:w-44 pl-4 pr-10 py-3.5 rounded-xl text-slate-800 text-sm bg-white outline-none cursor-pointer shadow-sm"
              >
                <option value="">Toute région</option>
                {regions.map(r => <option key={r.nom} value={r.nom}>{r.nom}</option>)}
              </select>
              <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button type="submit" className="bg-agrishop-600 hover:bg-agrishop-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-sm shadow-lg shadow-agrishop-700/30 hover:shadow-agrishop-700/40">
              Rechercher
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Link href="/create-ad" className="inline-flex items-center gap-2 bg-earth-500 hover:bg-earth-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg group">
            <PlusCircle size={18} /> Publier une annonce <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
          <Link href="/search" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm transition">
            Explorer les annonces <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 mt-8 pt-6 border-t border-white/10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">10K+</p>
            <p className="text-xs text-white/60 mt-0.5">Annonces</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">500+</p>
            <p className="text-xs text-white/60 mt-0.5">Vendeurs</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">11</p>
            <p className="text-xs text-white/60 mt-0.5">Départements</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-white">Gratuit</p>
            <p className="text-xs text-white/60 mt-0.5">Publication</p>
          </div>
        </div>
      </div>
    </section>
  )
}