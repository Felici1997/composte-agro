'use client'
import Link from "next/link"
import { Leaf } from "lucide-react"
import { categories } from "@/lib/categories"

const Footer = () => {
  const catMid = Math.ceil(categories.length / 2)
  const catCol1 = categories.slice(0, catMid)
  const catCol2 = categories.slice(catMid)

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <Leaf size={24} className="text-composte-400" />
              <span className="text-lg font-semibold text-white">composte<span className="text-composte-400">.</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Le marché agricole de proximité. Trouvez matériel, animaux, terrains et services agricoles près de chez vous.
            </p>
          </div>

          {/* Categories col 1 */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Catégories</h3>
            <ul className="space-y-2">
              {catCol1.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-400 hover:text-composte-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Autres catégories</h3>
            <ul className="space-y-2">
              {catCol2.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.id}`} className="text-sm text-slate-400 hover:text-composte-400 transition">{cat.nom}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Composte</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-slate-400 hover:text-composte-400 transition">Aide</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-composte-400 transition">À propos</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-composte-400 transition">Contact</Link></li>
              <li><Link href="/legal" className="text-sm text-slate-400 hover:text-composte-400 transition">CGU & Confidentialité</Link></li>
            </ul>
            <div className="flex gap-3 mt-4">
              {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((name) => (
                <Link key={name} href={`https://${name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:bg-composte-700 hover:text-white transition font-medium"
                  aria-label={name}>
                  {name[0]}
                </Link>
              ))}
            </div>
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
