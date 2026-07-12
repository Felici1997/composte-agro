'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Package, Users, MapPin, ShoppingBag } from 'lucide-react'

export default function TrustBar() {
  const { list: ads } = useSelector(state => state.ads)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { icon: ShoppingBag, value: mounted ? ads.length : 0, label: 'Annonces en ligne', suffix: '' },
    { icon: Package, value: mounted ? ads.filter(a => a.contentType === 'product').length : 0, label: 'Produits agricoles', suffix: '' },
    { icon: Users, value: mounted ? new Set(ads.map(a => a._profile?.id || a.seller_id || a.vendeur_id || a.prestataire_id)).size : 0, label: 'Vendeurs actifs', suffix: '+' },
    { icon: MapPin, value: 11, label: 'Départements couverts', suffix: '' },
  ]

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-agrishop-50 flex items-center justify-center mx-auto mb-2">
                <Icon size={20} className="text-agrishop-600" />
              </div>
              <p className="text-xl font-bold text-slate-800">
                {mounted ? s.value : '—'}
                <span className="text-agrishop-600">{s.suffix}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
