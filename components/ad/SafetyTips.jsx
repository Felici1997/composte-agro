'use client'
import { useState } from 'react'
import { ShieldAlert, ChevronDown, Eye, DollarSign, UserCheck, MessageCircle, AlertTriangle } from 'lucide-react'

const tips = [
  { icon: DollarSign, text: 'Ne versez jamais d\'argent avant d\'avoir vu le produit ou rencontré le vendeur.' },
  { icon: UserCheck, text: 'Vérifiez l\'identité du vendeur : demandez une pièce d\'identité ou un justificatif professionnel.' },
  { icon: Eye, text: 'Privilégiez les rencontres physiques ou les visites sur place pour constater l\'état du bien.' },
  { icon: MessageCircle, text: 'Échangez de préférence par téléphone ou via notre plateforme, pas uniquement par email.' },
  { icon: AlertTriangle, text: 'Méfiez-vous des offres trop alléchantes ou des vendeurs pressants.' },
  { icon: ShieldAlert, text: 'En cas de doute, signalez l\'annonce via le bouton "Signaler cette annonce".' },
]

export default function SafetyTips() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-medium transition ${
          open ? 'text-amber-800 bg-amber-50' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span className="flex items-center gap-2">
          <ShieldAlert size={16} className={open ? 'text-amber-500' : 'text-slate-400'} />
          Conseils de sécurité
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-amber-500' : ''}`} />
      </button>
      {open && (
        <div className="px-5 py-4 space-y-3 border-t border-slate-100 animate-slide-down">
          {tips.map((tip, i) => {
            const Icon = tip.icon
            return (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={13} className="text-amber-600" />
                </div>
                <span className="leading-relaxed">{tip.text}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}