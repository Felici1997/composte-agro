'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function TrustBar() {
  const { list: ads } = useSelector(state => state.ads)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { value: mounted ? ads.length : 0, label: 'Annonces en ligne', suffix: '', src: '/images/illustrations/marketplace-bro.svg' },
    { value: mounted ? ads.filter(a => a.contentType === 'product').length : 0, label: 'Produits agricoles', suffix: '', src: '/images/illustrations/peach-bro.svg' },
    { value: mounted ? new Set(ads.map(a => a._profile?.id || a.seller_id || a.vendeur_id || a.prestataire_id)).size : 0, label: 'Vendeurs actifs', suffix: '+', src: '/images/illustrations/self-confidence-bro.svg' },
    { value: 11, label: 'Départements couverts', suffix: '', src: '/images/illustrations/directions-bro.svg' },
  ]

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
            <div className="flex items-center justify-center mx-auto mb-1 h-16 w-full">
              <img src={s.src} alt={s.label} className="h-16 w-auto" />
            </div>
            <p className="text-xl font-bold text-slate-800">
              {mounted ? s.value : '—'}
              <span className="text-agrishop-600">{s.suffix}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
