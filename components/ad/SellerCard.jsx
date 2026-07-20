import { User, Calendar, Store, ShieldCheck, ChevronRight, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { getRelativeTime } from '@/lib/categories'

export default function SellerCard({ ad, sellerId }) {
  const name = ad._profile?.nom_complet || 'Particulier'
  const role = ad._profile?.role || 'particulier'
  const phone = ad._profile?.telephone || ''
  const created = ad.created_at || ad.createdAt || ''
  const isProfessional = role === 'vendeur' || role === 'prestataire'
  const roleLabel = role === 'vendeur' ? 'Vendeur' : role === 'prestataire' ? 'Prestataire' : 'Membre'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agrishop-100 to-agrishop-200 text-agrishop-700 flex items-center justify-center text-lg font-bold shrink-0 shadow-sm">
          {name[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-slate-800 text-sm truncate">{name}</p>
            {isProfessional && (
              <ShieldCheck size={15} className="text-blue-500 shrink-0" title="Professionnel vérifié" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 capitalize">{roleLabel}</span>
            {isProfessional && (
              <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Vérifié</span>
            )}
          </div>
        </div>
      </div>

      {created && (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5">
          <Calendar size={13} className="text-slate-400" />
          <span>Inscrit <span className="text-slate-500 font-medium">{getRelativeTime(created)}</span></span>
        </div>
      )}

      <div className="space-y-2.5">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2.5 w-full bg-agrishop-700 hover:bg-agrishop-800 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
          >
            <Phone size={16} /> {phone}
          </a>
        )}
        <a
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Bonjour%2C%20je%20vous%20contacter%20au%20sujet%20de%20votre%20annonce%20sur%20Composte`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>

      {isProfessional && (
        <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
          <span className="flex items-center gap-2 text-xs text-blue-700 font-medium">
            <ShieldCheck size={15} /> Professionnel vérifié
          </span>
          <ShieldCheck size={16} className="text-blue-400" />
        </div>
      )}

      {sellerId && (
        <Link
          href={`/search?seller=${sellerId}`}
          className="flex items-center justify-center gap-1.5 w-full text-xs text-agrishop-700 hover:text-agrishop-800 font-medium py-2 rounded-xl hover:bg-agrishop-50 transition"
        >
          Voir toutes ses annonces <ChevronRight size={13} />
        </Link>
      )}
    </div>
  )
}