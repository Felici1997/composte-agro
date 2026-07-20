import { ShieldCheck, CreditCard, RotateCcw, Headphones } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, title: 'Profils v\u00e9rifi\u00e9s', desc: 'Comptes professionnels authentifi\u00e9s manuellement', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: CreditCard, title: 'Paiement s\u00e9curis\u00e9', desc: 'Transactions prot\u00e9g\u00e9es via notre plateforme', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: RotateCcw, title: 'Annulation flexible', desc: 'Annulation gratuite sous 48h avant livraison', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Headphones, title: 'Service client', desc: 'Une \u00e9quipe disponible 7j/7 pour vous accompagner', color: 'text-violet-600', bg: 'bg-violet-50' },
]

export default function TrustBadges() {
  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((b, i) => {
          const Icon = b.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-agrishop-200 p-5 text-center">
              <div className={'w-12 h-12 ' + b.bg + ' rounded-2xl flex items-center justify-center mx-auto mb-3'}>
                <Icon size={24} className={b.color} />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
