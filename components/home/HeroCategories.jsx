'use client'
import Link from 'next/link'
import { categories } from '@/lib/categories'
import { getCategoryIcon } from '@/components/icons/StorysetIcons'

const bgColors = [
  'bg-agrishop-50 hover:bg-agrishop-100',
  'bg-amber-50 hover:bg-amber-100',
  'bg-blue-50 hover:bg-blue-100',
  'bg-orange-50 hover:bg-orange-100',
  'bg-rose-50 hover:bg-rose-100',
  'bg-teal-50 hover:bg-teal-100',
  'bg-purple-50 hover:bg-purple-100',
  'bg-cyan-50 hover:bg-cyan-100',
  'bg-lime-50 hover:bg-lime-100',
  'bg-yellow-50 hover:bg-yellow-100',
  'bg-sky-50 hover:bg-sky-100',
  'bg-pink-50 hover:bg-pink-100',
]

const iconColors = [
  'text-agrishop-600', 'text-amber-600', 'text-blue-600', 'text-orange-600',
  'text-rose-600', 'text-teal-600', 'text-purple-600', 'text-cyan-600',
  'text-lime-600', 'text-yellow-600', 'text-sky-600', 'text-pink-600',
]

export default function HeroCategories() {
  return (
    <section className="py-8">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Parcourir par catégorie <span className="text-slate-400 font-normal text-sm">({categories.length})</span></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat, i) => {
          const Icon = getCategoryIcon(cat.icone)
          return (
            <Link
              key={cat.id}
              href={`/c/${cat.id}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${bgColors[i % bgColors.length]} transition group`}
            >
              <Icon size={28} className={`${iconColors[i % iconColors.length]} group-hover:scale-110 transition`} />
              <span className="text-xs font-medium text-slate-700 text-center leading-tight">{cat.nom}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
