'use client'
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'Comment publier une annonce ?',
    a: 'Créez un compte gratuit, cliquez sur "Publier une annonce", remplissez les informations et ajoutez des photos. Votre annonce sera visible immédiatement.',
  },
  {
    q: 'La publication est-elle gratuite ?',
    a: 'Oui, publier une annonce sur Composte est totalement gratuit. Aucune commission n\'est prélevée sur les ventes.',
  },
  {
    q: 'Comment acheter un produit ?',
    a: 'Parcourez les annonces, utilisez les filtres pour affiner votre recherche, puis contactez directement le vendeur via le téléphone ou le formulaire de contact.',
  },
  {
    q: 'Comment contacter un vendeur ?',
    a: 'Sur chaque annonce, vous trouverez un bouton "Contacter". Vous pouvez aussi voir le numéro de téléphone du vendeur directement sur la page.',
  },
  {
    q: 'Les profils sont-ils vérifiés ?',
    a: 'Nous vérifions manuellement les comptes professionnels et encourageons les avis après chaque transaction pour garantir la confiance.',
  },
  {
    q: 'Puis-je vendre des services ?',
    a: 'Absolument ! Créez un compte prestataire et publiez vos services agricoles : labour, transport, conseil, etc.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-14">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-agrishop-50 text-agrishop-700 px-4 py-1.5 rounded-full text-xs font-medium mb-3">
          <HelpCircle size={14} /> Aide
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Questions fréquentes</h2>
        <p className="text-sm text-slate-500 mb-6">Tout ce que vous devez savoir sur Composte</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium transition ${
                open === i ? 'text-agrishop-700 bg-agrishop-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={17}
                className={`text-slate-400 transition-transform duration-200 shrink-0 ${open === i ? 'rotate-180 text-agrishop-600' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                open === i ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <p className="px-6 py-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
