'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Wrench, Users, ShoppingCart,
  MessageCircle, MessageSquare, Settings, Leaf, ChevronLeft,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/messagerie', label: 'Messagerie', icon: MessageCircle },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <Link href="/admin" className="flex items-center gap-1.5 px-5 h-14 border-b border-slate-100 shrink-0">
        <Leaf size={22} className="text-agrishop-600" />
        <span className="text-base font-semibold text-slate-800">
          composte
        </span>
        <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">admin</span>
      </Link>
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-agrishop-50 text-agrishop-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
        >
          <ChevronLeft size={14} />
          Retour au site
        </Link>
      </div>
    </aside>
  )
}
