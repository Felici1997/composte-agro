import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getCategoryById } from '@/lib/categories'

export default function FeaturedAds({ ads, title = 'Annonces sponsorisées' }) {
  const featured = ads.filter(a => a.sponsored || a.featured).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <div className="border border-amber-200 rounded-xl p-4 bg-gradient-to-br from-amber-50/50 to-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkles size={14} className="text-amber-600" />
        </div>
        <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {featured.map(ad => {
          const cat = getCategoryById(ad.category_id)
          const img = ad.images?.[0] || ad.image_url || ''
          const titleText = ad.title || ad.titre || ad.nom || ''
          const price = ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null
          return (
            <Link key={ad.id} href={`/ad/${ad.id}`} className="group bg-white rounded-lg border border-amber-100 overflow-hidden hover:border-amber-300 hover:shadow-sm transition">
              <div className="h-24 bg-slate-50 overflow-hidden">
                {img ? (
                  <Image src={img} alt={titleText} width={200} height={150} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 text-xs">—</div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-500 truncate">{cat?.nom || ''}</p>
                <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{titleText}</p>
                <p className="text-xs font-bold text-agrishop-600 mt-0.5">{price != null ? formatPrice(price) : 'Sur devis'}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
