const steps = [
  {
    src: '/images/illustrations/online-groceries-bro.svg',
    title: 'Publiez gratuitement',
    desc: 'Déposez votre annonce en 2 minutes. Producteurs, services ou clients — tout le monde peut publier.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    src: '/images/illustrations/online-groceries-pana.svg',
    title: 'Trouvez des acheteurs',
    desc: "Des milliers d'agriculteurs et professionnels consultent les annonces chaque jour près de chez vous.",
    color: 'from-blue-500 to-blue-600',
  },
  {
    src: '/images/illustrations/online-world-cuate.svg',
    title: 'Échangez et vendez',
    desc: 'Contactez directement les vendeurs par téléphone ou message. Aucune commission sur les ventes.',
    color: 'from-amber-500 to-amber-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-14">
      <div className="text-center mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Comment ça marche ?</h2>
        <p className="text-sm text-slate-500 mb-6">Rejoignez la communauté agricole en 3 étapes simples</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="relative bg-white border border-slate-200 rounded-2xl p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={'absolute -top-px left-6 right-6 h-1 rounded-full bg-gradient-to-r ' + step.color + ' opacity-0 group-hover:opacity-100 transition-opacity'} />
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-agrishop-600 to-agrishop-700 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-agrishop-700/20">
              {i + 1}
            </div>
            <div className="flex items-center justify-center mx-auto mb-5 h-28 w-full group-hover:scale-110 transition-transform duration-300">
              <img src={step.src} alt={step.title} className="h-28 w-auto" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2 text-base">{step.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
