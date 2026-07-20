'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ShoppingBag, Users, MapPin, BadgeCheck } from 'lucide-react'

export default function TrustBar() {
  const { list: ads } = useSelector(state => state.ads)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { value: mounted ? ads.length : 0, label: 'Annonces en ligne', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { value: mounted ? ads.filter(a => a.contentType === 'product').length : 0, label: 'Producteurs', icon: BadgeCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: mounted ? new Set(ads.map(a => a._profile?.id || a.client_id || a.vendeur_id || a.prestataire_id)).size : 0, label: 'Vendeurs actifs', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
    { value: 11, label: 'Departements couverts', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-agrishop-200 p-5 flex items-start gap-4">
              <div className={'w-11 h-11 ' + s.bg + ' rounded-xl flex items-center justify-center shrink-0'}>
                <Icon size={22} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
                  {mounted ? (typeof s.value === 'number' ? s.value.toLocaleString('fr-FR') : s.value) : '-'}
                </p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
