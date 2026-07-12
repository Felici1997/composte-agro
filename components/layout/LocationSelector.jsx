'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronDown } from 'lucide-react'
import { regions } from '@/lib/categories'

const departments = regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i)

export default function LocationSelector() {
  const router = useRouter()
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('composte_region')
    if (saved) setSelected(saved)
  }, [])

  const handleSelect = (dep) => {
    setSelected(dep)
    localStorage.setItem('composte_region', dep)
    setOpen(false)
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-agrishop-600 bg-slate-50 hover:bg-agrishop-50 border border-slate-200 hover:border-agrishop-300 px-3 py-1.5 rounded-full transition"
      >
        <MapPin size={13} className="text-agrishop-600" />
        <span className="max-w-24 truncate">{selected || 'Toute région'}</span>
        <ChevronDown size={12} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border rounded-xl py-2 min-w-44 max-h-60 overflow-y-auto z-20">
            <button
              onClick={() => handleSelect('')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-agrishop-50 transition ${!selected ? 'text-agrishop-600 font-medium' : 'text-slate-600'}`}
            >
              Toute la région
            </button>
            {departments.map((dep) => (
              <button
                key={dep}
                onClick={() => handleSelect(dep)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-agrishop-50 transition ${selected === dep ? 'text-agrishop-600 font-medium bg-agrishop-50' : 'text-slate-600'}`}
              >
                {dep}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
