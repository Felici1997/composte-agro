import Link from 'next/link'
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export default function PromoSidebar({ role }) {
  if (role === 'vendeur' || role === 'prestataire') return null

  return (
    <div className="bg-gradient-to-br from-agrishop-700 to-emerald-800 rounded-2xl p-6 text-white shadow-lg">
      <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3">
        <Sparkles size={22} />
      </div>
      <h3 className="text-sm font-bold mb-1.5">Boostez vos ventes</h3>
      <p className="text-xs text-white/70 leading-relaxed mb-5">
        Mettez vos annonces en avant et touchez plus d&apos;acheteurs avec un compte professionnel.
      </p>
      <Link
        href="/auth/register"
        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-agrishop-800 px-5 py-2.5 rounded-xl hover:bg-agrishop-50 transition shadow-lg shadow-black/10 group"
      >
        Devenir PRO <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}