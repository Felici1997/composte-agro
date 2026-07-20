'use client'
import { Search, Heart, PlusCircle, Menu, X, User, LogOut, LayoutDashboard, ShoppingCart, Package, Store, Wrench, ClipboardList, Star, ChevronDown, Settings } from "lucide-react"
import LocationSelector from "./LocationSelector"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setProfile, logout as reduxLogout } from "@/lib/features/auth/authSlice";
import { supabase, fetchWithTimeout } from "@/lib/supabase/client";
import MegaMenu from "./MegaMenu"
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
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [user, setLocalUser] = useState(null);
  const [profile, setLocalProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const favoriteCount = useSelector(state => state.favorites.ids.length);
  const cartCount = useSelector(state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => { setMounted(true) }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    const getSession = async () => {
      try {
        const { data: { session } } = await fetchWithTimeout(supabase.auth.getSession(), 10000)
        if (cancelled) return
        setLocalUser(session?.user || null)
        dispatch(setUser(session?.user || null))
        if (session?.user) {
          const { data: p } = await fetchWithTimeout(supabase.from('profiles').select('role, nom_complet').eq('id', session.user.id).maybeSingle(), 10000)
          if (!cancelled) {
            setLocalProfile(p)
            dispatch(setProfile(p))
          }
        }
      } catch {
        if (!cancelled) {
          setLocalUser(null)
          dispatch(setUser(null))
        }
      }
    }
    getSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLocalUser(session?.user || null)
      dispatch(setUser(session?.user || null))
      if (session?.user) {
        try {
          const { data: p } = await fetchWithTimeout(supabase.from('profiles').select('role, nom_complet').eq('id', session.user.id).maybeSingle(), 10000)
          setLocalProfile(p)
          dispatch(setProfile(p))
        } catch {
          setLocalProfile(null)
          dispatch(setProfile(null))
        }
      } else {
        setLocalProfile(null)
        dispatch(setProfile(null))
      }
    })
    return () => { cancelled = true; subscription?.unsubscribe() }
  }, [dispatch])

  useEffect(() => {
    const handler = () => setMobileMenu(true)
    window.addEventListener('open-mobile-menu', handler)
    return () => window.removeEventListener('open-mobile-menu', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  const handleLogout = async () => {
    try {
      await fetchWithTimeout(supabase.auth.signOut(), 5000)
    } catch {
    }
    setLocalUser(null)
    setLocalProfile(null)
    dispatch(reduxLogout())
    setUserMenu(false)
    setMobileMenu(false)
    router.push('/')
  }

  const role = profile?.role || 'client'
  const links = user ? roleLinks[role] || roleLinks.client : []

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
        : 'bg-white/95 border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group" aria-label="Accueil Composte">
            <span className="text-xl font-bold text-agrishop-700 group-hover:text-agrishop-600 transition">
              composte
            </span>
          </Link>

          {/* Nav links (desktop) */}
          {user ? (
            <div className="hidden lg:flex items-center gap-0.5">
              {links.map(link => {
                const joyrideAttr = (
                  link.label === 'Explorer' ? 'explore' :
                  link.label === 'Déposer une annonce' || link.label === 'Nouveau produit' || link.label === 'Nouveau service' ? 'create-ad' :
                  link.label === 'Mes annonces' || link.label === 'Mes produits' || link.label === 'Mes services' ? 'my-items' :
                  null
                )
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    {...(joyrideAttr ? { 'data-joyride': joyrideAttr } : {})}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-agrishop-700 hover:bg-agrishop-50 rounded-lg transition-all"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ) : (
            <MegaMenu />
          )}

          {/* Location + Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md gap-2">
            <LocationSelector />
            <form onSubmit={handleSearch} className="flex items-center flex-1 gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full focus-within:border-agrishop-400 focus-within:ring-2 focus-within:ring-agrishop-100 transition-all">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
              type="text"
              placeholder="Rechercher matériel, animaux, services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une annonce"
              data-joyride="nav-search"
            />
          </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">

            {(!user || profile?.role === 'client') && (
              <Link href="/cart" className="relative p-2.5 text-slate-500 hover:text-agrishop-700 hover:bg-agrishop-50 rounded-xl transition" aria-label="Panier">
                <ShoppingCart size={20} />
                <span className={`absolute top-1 right-1 bg-agrishop-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-opacity ${cartCount > 0 && mounted ? 'opacity-100' : 'opacity-0'}`}>
                  {mounted ? cartCount : 0}
                </span>
              </Link>
            )}

            <Link href="/favorites" className="relative p-2.5 text-slate-500 hover:text-agrishop-700 hover:bg-agrishop-50 rounded-xl transition" aria-label="Mes favoris">
              <Heart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1.5 text-slate-500 hover:text-agrishop-700 hover:bg-agrishop-50 rounded-xl transition" aria-label="Menu utilisateur">
                  <div className="w-8 h-8 bg-agrishop-100 text-agrishop-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border border-slate-200 rounded-2xl py-2 min-w-52 z-20 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-medium text-slate-800 text-sm truncate">{profile?.nom_complet || 'Utilisateur'}</p>
                        <p className="text-xs text-slate-400 capitalize mt-0.5">{role}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setUserMenu(false)} data-joyride="dashboard-link" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-agrishop-50 transition">
                          <LayoutDashboard size={16} className="text-slate-400" /> Tableau de bord
                        </Link>
                        <Link href="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-agrishop-50 transition">
                          <Settings size={16} className="text-slate-400" /> Mon profil
                        </Link>
                        <Link href="/favorites" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-agrishop-50 transition">
                          <Heart size={16} className="text-slate-400" /> Mes favoris
                        </Link>
                      </div>
                      <hr className="border-slate-100" />
                      <div className="py-1">
                        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                          <LogOut size={16} /> Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-agrishop-700 px-3.5 py-2 transition">
                  Connexion
                </Link>
                <Link href="/auth/register" className="text-sm font-medium bg-agrishop-700 text-white px-4 py-2 rounded-lg hover:bg-agrishop-800 transition shadow-sm">
                  Inscription
                </Link>
              </div>
            )}

            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition" aria-label="Menu">
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[85vh] overflow-y-auto animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full focus-within:border-agrishop-400 focus-within:ring-2 focus-within:ring-agrishop-100 transition-all">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400" type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>

            {user ? (
              <>
                <div className="space-y-0.5">
                  {links.map(link => {
                    const joyrideAttr = (
                      link.label === 'Explorer' ? 'explore' :
                      link.label === 'Déposer une annonce' || link.label === 'Nouveau produit' || link.label === 'Nouveau service' ? 'create-ad' :
                      link.label === 'Mes annonces' || link.label === 'Mes produits' || link.label === 'Mes services' ? 'my-items' :
                      null
                    )
                    return (
                      <Link key={link.href + link.label} href={link.href} onClick={() => setMobileMenu(false)} {...(joyrideAttr ? { 'data-joyride': joyrideAttr } : {})} className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-agrishop-700 hover:bg-agrishop-50 py-2.5 px-3 rounded-lg transition">
                        <link.icon size={18} className="text-slate-400" /> {link.label}
                      </Link>
                    )
                  })}
                </div>

                <hr className="border-slate-100" />

                <Link href="/dashboard" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 text-sm text-slate-600 hover:text-agrishop-700 py-2.5 px-3 rounded-lg hover:bg-slate-50 transition">
                  <LayoutDashboard size={16} className="text-slate-400" /> Tableau de bord
                </Link>
                <Link href="/favorites" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 text-sm text-slate-600 hover:text-agrishop-700 py-2.5 px-3 rounded-lg hover:bg-slate-50 transition">
                  <Heart size={16} className="text-slate-400" /> Mes favoris
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-red-600 hover:text-red-700 py-2.5 px-3 rounded-lg hover:bg-red-50 w-full text-left transition">
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/create-ad" onClick={() => setMobileMenu(false)} className="flex items-center justify-center gap-2 w-full bg-agrishop-700 hover:bg-agrishop-800 text-white text-sm font-medium px-4 py-3 rounded-xl transition shadow-sm">
                  <PlusCircle size={18} /> Déposer une annonce
                </Link>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Catégories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link key={cat.id} href={`/c/${cat.id}`} onClick={() => setMobileMenu(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-agrishop-700 hover:bg-agrishop-50 py-2.5 px-3 rounded-lg transition">
                        {cat.nom}
                      </Link>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="flex flex-col gap-1 px-3">
                  <Link href="/auth/login" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-agrishop-700 hover:underline py-2">
                    Connexion
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenu(false)} className="text-sm font-medium bg-agrishop-700 text-white px-4 py-2.5 rounded-lg hover:bg-agrishop-800 transition text-center shadow-sm">
                    Créer un compte
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar