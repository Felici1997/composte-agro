'use client'
import { useState } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/categories'
import { ChevronDown } from 'lucide-react'

const visibleCount = 6

export default function CategoryMenu() {
  const [showAll, setShowAll] = useState(false)
  const visible = categories.slice(0, visibleCount)
  const rest = categories.slice(visibleCount)

  return (
    <div className="hidden lg:flex items-center gap-0.5 overflow-hidden">
      {visible.map((cat) => (
        <Link
          key={cat.id}
          href={`/c/${cat.id}`}
          className="px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-composte-600 hover:bg-composte-50 rounded-md transition whitespace-nowrap shrink-0"
        >
          {cat.nom}
        </Link>
      ))}
      {rest.length > 0 && (
        <div className="relative shrink-0" onMouseEnter={() => setShowAll(true)} onMouseLeave={() => setShowAll(false)}>
          <button className="flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-composte-600 hover:bg-composte-50 rounded-md transition whitespace-nowrap">
            Plus <ChevronDown size={12} className={`transition ${showAll ? 'rotate-180' : ''}`} />
          </button>
          {showAll && (
            <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border rounded-lg py-2 min-w-44 z-50">
              {rest.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/c/${cat.id}`}
                  className="block px-4 py-2 text-sm text-slate-600 hover:bg-composte-50 hover:text-composte-700 whitespace-nowrap"
                >
                  {cat.nom}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
