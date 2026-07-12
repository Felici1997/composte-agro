import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ category, title }) {
  const items = [
    { label: 'Accueil', href: '/' },
    ...(category ? [{ label: category.nom, href: `/c/${category.id}` }] : []),
    ...(title ? [{ label: title, href: null }] : []),
  ]

  return (
    <nav className="flex items-center gap-1 text-xs text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="text-slate-300 shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-agrishop-600 transition flex items-center gap-1">
              {i === 0 && <Home size={12} />}
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-500 truncate max-w-40">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
