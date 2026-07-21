'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Store, Star } from 'lucide-react'

export default function FeaturedSellers() {
  const { list: ads } = useSelector(state => state.ads)
  const [sellers, setSellers] = useState([])

  useEffect(() => {
    const sellerMap = {}
    ads.forEach(ad => {
      const profile = ad._profile
      if (!profile) return
      const id = profile.id || ad.client_id || ad.vendeur_id || ad.prestataire_id
      if (!id) return
      if (!sellerMap[id]) {
        sellerMap[id] = {
          id,
          name: profile.nom_complet || profile.nom || 'Anonyme',
          avatar: profile.avatar_url || null,
          count: 0,
          ads: [],
        }
      }
      sellerMap[id].count++
      sellerMap[id].ads.push(ad)
    })
    const sorted = Object.values(sellerMap).sort((a, b) => b.count - a.count).slice(0, 4)
    setSellers(sorted)
  }, [ads])

  if (sellers.length === 0) return null

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Vendeurs actifs</h2>
          <p className="text-sm text-slate-500 mb-6 mb-0">Les membres les plus actifs du moment</p>
        </div>
        <Link href="/search" className="text-sm font-medium text-agrishop-700 hover:text-agrishop-800 hover:underline shrink-0">
          Voir tout â†’
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            href={`/search?seller=${seller.id}`}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {seller.avatar ? (
              <img src={seller.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-slate-100 group-hover:ring-agrishop-200 transition" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-agrishop-100 to-agrishop-200 text-agrishop-700 flex items-center justify-center mx-auto mb-3 text-lg font-bold ring-2 ring-slate-100 group-hover:ring-agrishop-200 transition">
                {seller.name[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <h3 className="text-sm font-semibold text-slate-700 group-hover:text-agrishop-700 truncate">
              {seller.name}
            </h3>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Store size={13} className="text-slate-400" />
              <span className="text-xs text-slate-500">{seller.count} annonce{seller.count > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
