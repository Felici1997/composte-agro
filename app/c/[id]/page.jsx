'use client'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdCard from '@/components/AdCard'
import { getCategoryById } from '@/lib/categories'

export default function CategoryPage() {
  const { id } = useParams()
  const cat = getCategoryById(id)
  const ads = useSelector(state => state.ads.list)
  const catAds = ads.filter(a => a.category_id === parseInt(id) && a.status !== 'inactive')

  if (!cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-slate-400 font-medium">Catégorie introuvable</h1>
        <Link href="/" className="inline-block mt-4 text-sm text-composte-600 hover:underline">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft size={16} /> Accueil
      </Link>

      <h1 className="text-xl font-semibold text-slate-700 mb-1">{cat.nom}</h1>
      <p className="text-sm text-slate-400 mb-6">{catAds.length} annonce{catAds.length > 1 ? 's' : ''}</p>

      {catAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {catAds.map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400 font-medium">Aucune annonce dans cette catégorie</p>
          <Link href="/" className="inline-block mt-2 text-sm text-composte-600 hover:underline">Voir toutes les annonces</Link>
        </div>
      )}
    </div>
  )
}
