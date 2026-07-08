'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
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
    <section className="bg-gradient-to-br from-agrishop-800 via-agrishop-700 to-agrishop-900 rounded-2xl p-6 sm:p-10 text-white mt-4 shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Le marché agricole de proximité</h1>
      <p className="text-agrishop-100 text-sm sm:text-base mb-6">Trouvez matériel, animaux, terrains et services près de chez vous</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Que cherchez-vous ? (tracteur, semences...)"
            className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-800 text-sm bg-white outline-none"
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
    </section>
  )
}
