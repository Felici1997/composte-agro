'use client'
import Link from 'next/link'
import { categories } from '@/lib/categories'
import { Tractor, Droplets, Wrench, Sprout, Cpu, Briefcase } from 'lucide-react'

const categoryIcons = {
  1: Tractor, 2: Droplets, 6: Wrench, 7: Sprout, 42: Cpu, 43: Briefcase,
}

export default function HeroCategories() {
  return (
    <section data-joyride="categories" className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Parcourir par cat\u00e9gorie</h2>
          <p className="text-sm text-slate-500 mb-0">{categories.length} cat\u00e9gories disponibles</p>
        </div>
        <Link href="/search" className="text-sm font-medium text-agrishop-700 hover:text-agrishop-800 hover:underline shrink-0">
          Voir tout \u2192
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.id]
          return (
            <Link key={cat.id} href={'/c/' + cat.id}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 hover:border-agrishop-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-14 h-14 rounded-2xl bg-agrishop-50 flex items-center justify-center text-agrishop-600 group-hover:bg-agrishop-100 group-hover:text-agrishop-700 transition-colors">
                {Icon ? <Icon size={26} /> : <span className="text-lg font-bold text-agrishop-400">{cat.nom[0]}</span>}
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight group-hover:text-agrishop-700 transition-colors">{cat.nom}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
