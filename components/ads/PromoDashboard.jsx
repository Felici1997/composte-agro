import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'

export default function PromoDashboard({ role }) {
  if (role === 'vendeur' || role === 'prestataire') return null

  return (
    <div className="bg-gradient-to-br from-agrishop-600 to-emerald-700 rounded-xl p-4 text-white flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">Passez en compte PRO</p>
          <p className="text-xs text-white/70">Plus de visibilité, plus de ventes</p>
        </div>
      </div>
      <Link
        href="/auth/register"
        className="flex items-center gap-1 text-xs font-semibold bg-white text-agrishop-700 px-4 py-2 rounded-lg hover:bg-agrishop-50 transition shrink-0"
      >
        Je veux PRO <ArrowRight size={12} />
      </Link>
    </div>
  )
}
