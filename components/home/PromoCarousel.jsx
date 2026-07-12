'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, TrendingUp, Leaf } from 'lucide-react'

const slides = [
  {
    icon: ShoppingBag,
    title: 'Nouveau sur Composte ?',
    desc: 'Publiez votre première annonce gratuitement et touchez des milliers d\'acheteurs dès aujourd\'hui.',
    cta: 'Publier une annonce',
    href: '/create-ad',
    gradient: 'from-agrishop-700 to-emerald-700',
    iconBg: 'bg-white/20',
  },
  {
    icon: TrendingUp,
    title: 'Boostez votre visibilité',
    desc: 'Mettez vos annonces en avant et augmentez vos ventes avec nos options de promotion.',
    cta: 'En savoir plus',
    href: '/help',
    gradient: 'from-amber-600 to-orange-600',
    iconBg: 'bg-white/20',
  },
  {
    icon: Leaf,
    title: 'Conseils agricoles',
    desc: 'Découvrez nos guides et astuces pour réussir dans l\'agriculture au Congo.',
    cta: 'Lire les articles',
    href: '/help',
    gradient: 'from-emerald-600 to-teal-600',
    iconBg: 'bg-white/20',
  },
]

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? slides.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === slides.length - 1 ? 0 : c + 1))

  const s = slides[current]
  const Icon = s.icon

  return (
    <section className="py-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className={`bg-gradient-to-br ${s.gradient} p-6 sm:p-8 text-white`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center shrink-0 hidden sm:flex`}>
              <Icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold mb-1.5">{s.title}</h3>
              <p className="text-sm text-white/80 max-w-md mb-4">{s.desc}</p>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 bg-white text-sm font-semibold px-5 py-2.5 rounded-lg text-slate-800 hover:bg-slate-50 transition shadow"
              >
                {s.cta} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Dots + arrows */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button onClick={prev} className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition">
            <ChevronLeft size={15} />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}
