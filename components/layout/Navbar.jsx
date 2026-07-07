'use client'
import { Search, Heart, PlusCircle, Menu, X, User, LogOut, LayoutDashboard, ShoppingCart, Package, Store, Wrench, ClipboardList, Star, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/lib/supabase/client";
import CategoryMenu from "./CategoryMenu";
import { categories } from "@/lib/categories";

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

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const favoriteCount = useSelector(state => state.favorites.ids.length);
  const cartCount = useSelector(state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => { setMounted(true) }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) {
        const { data: p } = await supabase.from('profiles').select('role, nom_complet').eq('id', session.user.id).maybeSingle()
        setProfile(p)
      }
    }
    getSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenu(false)
    setMobileMenu(false)
    router.push('/')
  }

  const role = profile?.role || 'client'
  const links = user ? roleLinks[role] || roleLinks.client : []

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 shrink-0" aria-label="Accueil Composte">
            <Image src="/logo.png" alt="Composte" width={80} height={80} className="-ml-2 shrink-0" />
            <span className="text-xl font-semibold text-slate-800">
              composte<span className="text-composte-600">.</span>
            </span>
          </Link>

          {/* Nav links (desktop) */}
          {user ? (
            <div className="hidden lg:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-composte-600 hover:bg-composte-50 rounded-lg transition whitespace-nowrap"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          ) : (
            <CategoryMenu />
          )}

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full focus-within:border-composte-400 focus-within:ring-1 focus-within:ring-composte-200 transition">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              className="w-full bg-transparent outline-none text-sm placeholder-slate-400"
              type="text"
              placeholder="Rechercher matériel, animaux, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une annonce"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">

            <Link href="/cart" className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition" aria-label="Panier">
              <ShoppingCart size={20} />
              <span className={`absolute -top-0.5 -right-0.5 bg-composte-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-opacity ${cartCount > 0 && mounted ? 'opacity-100' : 'opacity-0'}`}>
                {mounted ? cartCount : 0}
              </span>
            </Link>

            <Link href="/favorites" className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition" aria-label="Mes favoris">
              <Heart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition" aria-label="Menu utilisateur">
                  <div className="w-8 h-8 bg-composte-100 text-composte-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition ${userMenu ? 'rotate-180' : ''}`} />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border rounded-xl py-2 min-w-52 z-20">
                      <div className="px-4 py-2 text-sm border-b border-slate-100">
                        <p className="font-medium text-slate-800 truncate">{profile?.nom_complet || 'Utilisateur'}</p>
                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-composte-50">
                        <LayoutDashboard size={16} /> Tableau de bord
                      </Link>
                      <Link href="/favorites" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-composte-50">
                        <Heart size={16} /> Mes favoris
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-composte-600 px-3 py-2 transition">
                Connexion
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full" aria-label="Menu">
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lg:hidden border-t bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input className="w-full bg-transparent outline-none text-sm" type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>

            {user ? (
              <>
                {/* Role-based mobile links */}
                <div className="space-y-1">
                  {links.map(link => (
                    <Link key={link.href + link.label} href={link.href} onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-composte-600 hover:bg-composte-50 py-2.5 px-2 rounded-lg transition">
                      <link.icon size={18} /> {link.label}
                    </Link>
                  ))}
                </div>

                <hr />

                <Link href="/dashboard" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-composte-600 py-2">
                  <LayoutDashboard size={16} /> Tableau de bord
                </Link>
                <Link href="/favorites" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-composte-600 py-2">
                  <Heart size={16} /> Mes favoris
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 py-2 w-full text-left">
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                {/* Categories for non-connected */}
                <Link href="/create-ad" onClick={() => setMobileMenu(false)} className="flex items-center justify-center gap-2 w-full bg-composte-600 hover:bg-composte-700 text-white text-sm font-medium px-4 py-3 rounded-lg transition">
                  <PlusCircle size={18} /> Déposer une annonce
                </Link>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Catégories</p>
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <Link key={cat.id} href={`/c/${cat.id}`} onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-composte-600 hover:bg-composte-50 py-2 px-2 rounded-lg transition">
                        {cat.nom}
                      </Link>
                    ))}
                  </div>
                </div>

                <hr />

                <Link href="/favorites" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-composte-600 py-2">
                  <Heart size={16} /> Mes favoris
                </Link>
                <Link href="/auth/login" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-composte-600 hover:underline py-2">
                  Connexion / Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
