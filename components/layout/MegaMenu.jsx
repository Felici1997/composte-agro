'use client'
import { useState } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/categories'
import { ChevronDown } from 'lucide-react'

const categoryIcons = {
  1: '🐄', 2: '🌱', 6: '🔧', 7: '🌾', 42: '🏭', 43: '🔨',
}

const categoryDesc = {
  1: 'Bovins, ovins, caprins, volailles et équidés',
  2: 'Semences, engrais, pesticides et aliments',
  6: 'Tracteurs, outils, irrigation et stockage',
  7: 'Terres, pépinières, maraîchage et foresterie',
  42: 'Transformation, conservation et conditionnement',
  43: 'Labour, transport, conseil et entretien',
}

export default function MegaMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-agrishop-600 hover:bg-agrishop-50 rounded-lg transition">
        Catégories
        <ChevronDown size={14} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0 bg-white shadow-xl border rounded-b-xl py-4 min-w-[600px] z-50">
          <div className="grid grid-cols-2 gap-0">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/c/${cat.id}`}
                className="flex items-start gap-3 px-5 py-3 hover:bg-agrishop-50 transition group"
              >
                <span className="text-xl leading-none mt-0.5">{categoryIcons[cat.id] || '📦'}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-agrishop-600">
                    {cat.nom}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{categoryDesc[cat.id] || ''}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 px-5 pt-3 pb-1">
            <Link href="/search" className="text-xs font-medium text-agrishop-600 hover:underline">
              Voir toutes les annonces →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
