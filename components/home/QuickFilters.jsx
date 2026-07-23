'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Flame, Clock, Briefcase, Users, DollarSign, MapPin } from 'lucide-react'

const filters = [
  { label: 'Nouveautés', icon: Clock, params: { sort: 'date_desc' } },
  { label: 'Urgent', icon: Flame, params: { urgent: 'true' } },
  { label: 'Professionnels', icon: Briefcase, params: { pro: 'true' } },
  { label: 'Particuliers', icon: Users, params: { pro: 'false' } },
  { label: 'Petits prix', icon: DollarSign, params: { maxPrice: '50000' } },
  { label: 'Proche de moi', icon: MapPin, params: { near: 'true' } },
]

function QuickFiltersInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isActive = (params) =>
    Object.entries(params).every(([k, v]) => searchParams.get(k) === v)

  const handleClick = (params) => {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => sp.set(k, v))
    router.push(`/search?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filters.map((f, i) => {
        const Icon = f.icon
        const active = isActive(f.params)
        return (
          <button
            key={i}
            onClick={() => handleClick(f.params)}
            className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border whitespace-nowrap transition-all shrink-0 ${
              active
                ? 'bg-agrishop-700 text-white border-agrishop-700 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-agrishop-300 hover:text-agrishop-700 hover:bg-agrishop-50'
            }`}
          >
            <Icon size={14} />
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

export default function QuickFilters() {
  return (
    <Suspense fallback={<div className="h-9" />}>
      <div className="py-4">
        <QuickFiltersInner />
      </div>
    </Suspense>
  )
}
