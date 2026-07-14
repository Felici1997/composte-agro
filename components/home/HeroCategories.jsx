'use client'
import Link from 'next/link'
import Image from 'next/image'
import { categories } from '@/lib/categories'

const categoryImages = {
  1: '/images/categories/elevage.svg',
  2: '/images/categories/intrants.svg',
  6: '/images/categories/equipements.svg',
  7: '/images/categories/agriculture.svg',
  42: '/images/categories/transformation.svg',
  43: '/images/categories/services.svg',
}

export default function HeroCategories() {
  return (
    <section data-joyride="categories" className="py-8">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Parcourir par catégorie <span className="text-slate-400 font-normal text-sm">({categories.length})</span></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const imgSrc = categoryImages[cat.id]
          return (
            <Link
              key={cat.id}
              href={`/c/${cat.id}`}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-agrishop-300 hover:shadow-md transition group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-2 ring-slate-100 group-hover:ring-agrishop-200 transition">
                {imgSrc ? (
                  <Image src={imgSrc} alt={cat.nom} width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg font-bold">{cat.nom[0]}</div>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{cat.nom}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
