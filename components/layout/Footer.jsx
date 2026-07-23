'use client'
import Link from "next/link"
import Image from "next/image"
import { MapPin, Shield, HelpCircle, Newspaper } from 'lucide-react'
import { categories } from "@/lib/categories"

const Footer = () => {
  const catMid = Math.ceil(categories.length / 2)
  const catCol1 = categories.slice(0, catMid)
  const catCol2 = categories.slice(catMid)

  return (
    <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <Image src="/logo.png" alt="Composte" width={160} height={160} priority className="h-7 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              Le marché agricole de proximité. Trouvez matériel, animaux, terrains et services agricoles près de chez vous au Congo.
            </p>
            <div className="flex gap-2.5">
              {["Facebook", "Instagram", "X", "LinkedIn"].map((name) => (
                <Link key={name} href={`https://${name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-slate-800/50 rounded-xl flex items-center justify-center text-[10px] text-slate-500 hover:bg-agrishop-700 hover:text-white transition-all font-medium"
                  aria-label={name}>
                  {name[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories col 1 */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Catégories</h3>
            <ul className="space-y-2.5">
              {catCol1.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-500 hover:text-agrishop-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Autres catégories</h3>
            <ul className="space-y-2.5">
              {catCol2.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-500 hover:text-agrishop-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pour les vendeurs */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Vendeurs</h3>
            <ul className="space-y-2.5">
              <li><Link href="/create-ad" className="text-sm text-slate-500 hover:text-agrishop-400 transition">Publier une annonce</Link></li>
              <li><Link href="/" className="text-sm text-slate-500 hover:text-agrishop-400 transition">Tableau de bord</Link></li>
              <li><Link href="/auth/register" className="text-sm text-slate-500 hover:text-agrishop-400 transition">Créer un compte pro</Link></li>
              <li><Link href="/help/selling" className="text-sm text-slate-500 hover:text-agrishop-400 transition">Conseils vente</Link></li>
            </ul>
          </div>

          {/* Aide & Légal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Aide & Légal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/help" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-agrishop-400 transition"><HelpCircle size={14} />Centre d&apos;aide</Link></li>
              <li><Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-agrishop-400 transition"><Newspaper size={14} />À propos</Link></li>
              <li><Link href="/contact" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-agrishop-400 transition"><MapPin size={14} />Contact</Link></li>
              <li><Link href="/legal" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-agrishop-400 transition"><Shield size={14} />CGU & Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} Composte. Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0">Fait pour les agriculteurs et les passionnés du monde agricole.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer