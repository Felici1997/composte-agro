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
    <div className="bg-white border border-amber-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 transition"
      >
        <span className="flex items-center gap-1.5">
          <ShieldAlert size={15} /> Conseils de sécurité
        </span>
        <ChevronDown size={15} className={`text-amber-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2.5">
          {tips.map((tip, i) => {
            const Icon = tip.icon
            return (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <Icon size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{tip.text}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
