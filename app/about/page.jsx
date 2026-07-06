'use client'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <Leaf size={48} className="mx-auto text-composte-500 mb-4" />
      <h1 className="text-2xl font-semibold text-slate-700 mb-2">À propos de Composte</h1>
      <p className="text-sm text-slate-500 leading-relaxed">
        Composte est le marché agricole de proximité. Notre mission est de mettre en relation
        les agriculteurs, éleveurs, viticulteurs et professionnels du monde agricole pour faciliter
        l'achat et la vente de matériel, d'animaux, de terrains, de services et de produits fermiers.
      </p>
      <p className="text-sm text-slate-500 leading-relaxed mt-4">
        Lancé en 2026, Composte fait partie d'une nouvelle génération de plateformes dédiées
        à l'agriculture française, avec un focus sur la proximité et la confiance.
      </p>
      <Link href="/" className="inline-block mt-6 text-sm text-composte-600 hover:underline">Retour à l'accueil</Link>
    </div>
  )
}
