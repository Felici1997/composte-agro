'use client'
import Link from "next/link"
import { MapPin, Shield, HelpCircle, Newspaper } from 'lucide-react'
import { categories } from "@/lib/categories"

const Footer = () => {
  const catMid = Math.ceil(categories.length / 2)
  const catCol1 = categories.slice(0, catMid)
  const catCol2 = categories.slice(catMid)

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-lg font-semibold text-white">composte</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Le marché agricole de proximité. Trouvez matériel, animaux, terrains et services agricoles près de chez vous.
            </p>
            <div className="flex gap-2">
              {["Facebook", "Instagram", "X", "LinkedIn"].map((name) => (
                <Link key={name} href={`https://${name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:bg-agrishop-700 hover:text-white transition font-medium"
                  aria-label={name}>
                  {name[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories col 1 */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Catégories</h3>
            <ul className="space-y-2">
              {catCol1.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-400 hover:text-agrishop-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Autres catégories</h3>
            <ul className="space-y-2">
              {catCol2.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-400 hover:text-agrishop-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pour les vendeurs */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Pour les vendeurs</h3>
            <ul className="space-y-2">
              <li><Link href="/create-ad" className="text-sm text-slate-400 hover:text-agrishop-400 transition">Publier une annonce</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-400 hover:text-agrishop-400 transition">Tableau de bord</Link></li>
              <li><Link href="/auth/register" className="text-sm text-slate-400 hover:text-agrishop-400 transition">Créer un compte pro</Link></li>
              <li><Link href="/help/selling" className="text-sm text-slate-400 hover:text-agrishop-400 transition">Conseils vente</Link></li>
            </ul>
          </div>

          {/* Aide & Légal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Aide & Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-agrishop-400 transition"><HelpCircle size={14} />Centre d&apos;aide</Link></li>
              <li><Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-agrishop-400 transition"><Newspaper size={14} />À propos</Link></li>
              <li><Link href="/contact" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-agrishop-400 transition"><MapPin size={14} />Contact</Link></li>
              <li><Link href="/legal" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-agrishop-400 transition"><Shield size={14} />CGU & Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Composte. Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0">Fait pour les agriculteurs et les passionnés du monde agricole.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
