'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ShoppingBag, PlusCircle, Leaf, ArrowRight, Sparkles } from 'lucide-react'
import AdCard from '@/components/AdCard'

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="p-4 space-y-2.5">
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
      <div className="relative overflow-hidden bg-gradient-to-br from-agrishop-800 via-agrishop-700 to-emerald-800 rounded-3xl p-8 md:p-10 mb-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-agrishop-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium mb-3 border border-white/10">
              <Leaf size={14} className="text-emerald-300" />
              <span className="text-white/90">Composte</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Bienvenue !</h1>
            <p className="text-sm sm:text-base text-white/80 mt-1.5 max-w-xl">Trouvez produits, matériels et services agricoles près de chez vous au Congo.</p>
          </div>
          <Link href="/create-ad" className="inline-flex items-center gap-2 bg-white text-agrishop-800 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-agrishop-50 transition shadow-lg shadow-black/10 shrink-0 group">
            <PlusCircle size={18} /> Publier une annonce <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Producteurs</h2>
            <p className="text-sm text-slate-500 mb-6 mb-0">Produits frais et locaux des producteurs près de chez vous</p>
          </div>
          <Link href="/search?type=product" className="text-sm font-medium text-agrishop-700 hover:text-agrishop-800 hover:underline shrink-0">Voir tout â†’</Link>
        </div>
        {loading && products.length === 0 ? <SkeletonCards /> : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-14 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <ShoppingBag size={36} className="mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">Aucun produit pour le moment</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Services</h2>
            <p className="text-sm text-slate-500 mb-6 mb-0">Services agricoles près de chez vous</p>
          </div>
          <Link href="/search?type=service" className="text-sm font-medium text-agrishop-700 hover:text-agrishop-800 hover:underline shrink-0">Voir tout â†’</Link>
        </div>
        {loading && services.length === 0 ? <SkeletonCards /> : services.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.slice(0, 8).map(ad => <AdCard key={ad._key || ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="text-center py-14 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500">Aucun service pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
