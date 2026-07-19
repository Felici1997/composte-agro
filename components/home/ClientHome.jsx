'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, PlusCircle, Leaf, ArrowRight } from 'lucide-react'
import AdCard from '@/components/AdCard'

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ClientHome() {
  const { list: ads, loading } = useSelector(state => state.ads)
  const products = ads.filter(a => a.contentType === 'product')
  const services = ads.filter(a => a.contentType === 'service')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-agrishop-600 via-agrishop-700 to-emerald-800 rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={20} className="text-emerald-200" />
              <span className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Composte</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">Bienvenue !</h1>
            <p className="text-sm text-white/80 mt-1 max-w-lg">Trouvez produits, matériels et services agricoles près de chez vous au Congo.</p>
          </div>
          <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-agrishop-700 font-semibold px-5 py-3 rounded-xl text-sm hover:bg-agrishop-50 transition shadow-lg shadow-black/10 shrink-0 group">
            <PlusCircle size={18} /> Publier une annonce <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Producteurs</h2>
          <Link href="/search?type=product" className="text-sm text-agrishop-600 hover:underline font-medium">Voir tout →</Link>
        </div>
        {loading && products.length === 0 ? <SkeletonCards /> : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
            <ShoppingBag size={32} className="mx-auto mb-2 text-slate-200" />
            <p className="text-sm">Aucun produit pour le moment</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Services</h2>
          <Link href="/search?type=service" className="text-sm text-agrishop-600 hover:underline font-medium">Voir tout →</Link>
        </div>
        {loading && services.length === 0 ? <SkeletonCards /> : services.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.slice(0, 8).map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
            <p className="text-sm">Aucun service pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
