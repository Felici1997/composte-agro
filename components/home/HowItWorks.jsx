const steps = [
  {
    src: '/images/illustrations/online-groceries-bro.svg',
    title: 'Publiez gratuitement',
    desc: 'Déposez votre annonce en 2 minutes. Produits, services ou demandes — tout le monde peut publier.',
    bg: 'bg-emerald-50',
  },
  {
    src: '/images/illustrations/online-groceries-pana.svg',
    title: 'Trouvez des acheteurs',
    desc: 'Des milliers d\'agriculteurs et professionnels consultent les annonces chaque jour près de chez vous.',
    bg: 'bg-blue-50',
  },
  {
    src: '/images/illustrations/online-world-cuate.svg',
    title: 'Échangez et vendez',
    desc: 'Contactez directement les vendeurs par téléphone ou message. Aucune commission sur les ventes.',
    bg: 'bg-amber-50',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-12">
      <h2 className="text-lg font-semibold text-slate-700 text-center mb-2">Comment ça marche ?</h2>
      <p className="text-sm text-slate-400 text-center mb-8">Rejoignez la communauté agricole en 3 étapes</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="relative bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition group">
            <div className={`flex items-center justify-center mx-auto mb-4 h-24 w-full group-hover:scale-110 transition`}>
              <img src={step.src} alt={step.title} className="h-24 w-auto" />
            </div>
            <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-agrishop-600 text-white text-xs font-bold flex items-center justify-center shadow">
              {i + 1}
            </div>
            <h3 className="font-semibold text-slate-800 mb-1.5">{step.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
