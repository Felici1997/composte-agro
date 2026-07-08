'use client'
import { useEffect, useState, useRef } from 'react'
import { Search, ShoppingCart, PlusCircle, Package, ClipboardList, Store, Star, Wrench, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

const roleLinks = {
  client: [
    { label: 'Déposer une annonce', href: '/create-ad', icon: PlusCircle },
    { label: 'Mes annonces', href: '/dashboard', icon: ClipboardList },
    { label: 'Favoris', href: '/favorites', icon: Star },
    { label: 'Explorer', href: '/search', icon: Store },
  ],
  vendeur: [
    { label: 'Nouveau produit', href: '/create-ad', icon: PlusCircle },
    { label: 'Mes produits', href: '/dashboard', icon: Package },
    { label: 'Commandes', href: '/dashboard', icon: ShoppingCart },
    { label: 'Explorer', href: '/search', icon: Store },
  ],
  prestataire: [
    { label: 'Nouveau service', href: '/create-ad', icon: PlusCircle },
    { label: 'Mes services', href: '/dashboard', icon: Wrench },
    { label: 'Commandes', href: '/dashboard', icon: ShoppingCart },
    { label: 'Explorer', href: '/search', icon: Store },
  ],
}

export default function Navbar() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const cartCount = useSelector(state => state.cart.total)
  const menuRef = useRef(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data: p } = await supabase.from('profiles').select('role, nom_complet').eq('id', session.user.id).maybeSingle()
        setProfile(p)
      } else {
        setProfile(null)
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/search?q=${search}`)
    setSearch('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const role = profile?.role || 'client'
  const links = user ? roleLinks[role] || roleLinks.client : []
  const navLabel = !user ? 'Menu' : role === 'vendeur' ? 'Vendeur' : role === 'prestataire' ? 'Prestataire' : 'Client'

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 shrink-0">
            <Image src="/logo.png" alt="AgriShop" width={80} height={80} priority className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-agrishop-600 hover:bg-agrishop-50 rounded-lg transition"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center text-sm gap-2 bg-slate-100 px-3 py-2 rounded-xl">
              <Search size={16} className="text-slate-400" />
              <input className="w-36 bg-transparent outline-none placeholder-slate-400 text-slate-700" type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-slate-600 hover:text-agrishop-600 hover:bg-agrishop-50 rounded-lg transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold text-white bg-agrishop-600 size-4 flex items-center justify-center rounded-full">{cartCount}</span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-agrishop-600 hover:bg-agrishop-50 rounded-lg transition">
                  <div className="w-7 h-7 rounded-full bg-agrishop-100 flex items-center justify-center">
                    <User size={14} className="text-agrishop-600" />
                  </div>
                  <span className="hidden lg:inline">{profile?.nom_complet || user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} className={`hidden lg:block transition ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800">{profile?.nom_complet || 'Utilisateur'}</p>
                      <p className="text-xs text-slate-400 capitalize">{role}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                      <LayoutDashboard size={16} /> Tableau de bord
                    </Link>
                    <Link href="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                      <Star size={16} /> Favoris
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="px-5 py-2 bg-agrishop-600 hover:bg-agrishop-700 text-white text-sm font-medium rounded-xl transition">
                Connexion
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
              {mobileOpen ? <X size="20" /> : <Menu size="20" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="flex items-center text-sm gap-2 bg-slate-100 px-3 py-2.5 rounded-xl mb-2">
              <Search size={16} className="text-slate-400" />
              <input className="w-full bg-transparent outline-none placeholder-slate-400 text-slate-700" type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>
            {links.map(link => (
              <Link key={link.href + link.label} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-agrishop-50 hover:text-agrishop-600 rounded-lg transition">
                <link.icon size={18} /> {link.label}
              </Link>
            ))}
            {user && (
              <>
                <hr className="my-1 border-slate-100" />
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-agrishop-50 hover:text-agrishop-600 rounded-lg transition">
                  <LayoutDashboard size={18} /> Tableau de bord
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                  <LogOut size={18} /> Déconnexion
                </button>
              </>
            )}
            {!user && (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-agrishop-600 hover:bg-agrishop-50 rounded-lg transition">
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
