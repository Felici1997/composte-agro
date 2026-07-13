import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'

export default function PromoSidebar({ role }) {
  if (role === 'vendeur' || role === 'prestataire') return null

  return (
    <div className="bg-gradient-to-br from-agrishop-700 to-emerald-800 rounded-xl p-5 text-white">
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
        <TrendingUp size={20} />
      </div>
      <h3 className="text-sm font-semibold mb-1">Boostez vos ventes</h3>
      <p className="text-xs text-white/70 leading-relaxed mb-4">
        Mettez vos annonces en avant et touchez plus d'acheteurs avec un compte professionnel.
      </p>
      <Link
        href="/auth/register"
        className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-agrishop-700 px-4 py-2 rounded-lg hover:bg-agrishop-50 transition"
      >
        Devenir PRO <ArrowRight size={12} />
      </Link>
    </div>
  )
}
