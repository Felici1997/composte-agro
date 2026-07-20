'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, ArrowRight, Mail, Lock, Leaf, Sprout, ShieldCheck, Quote } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Veuillez remplir tous les champs')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message)
    } else {
      toast.success('Connecté !')
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left - Organic Biophilic decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center min-h-screen">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-agrishop-900/92 via-emerald-800/85 to-agrishop-950/92" />

        {/* Amorphous organic blobs */}
        <div className="absolute -top-48 -right-32 w-[600px] h-[600px] bg-white/[0.04] rounded-full animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-400/[0.04] rounded-full animate-blob" style={{ animationDelay: '-6s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-white/[0.02] rounded-full animate-blob" style={{ animationDelay: '-3s' }} />

        {/* Floating leaf decorations */}
        <div className="absolute top-[18%] left-[12%] text-white/15 animate-float-slow">
          <Leaf size={32} />
        </div>
        <div className="absolute top-[65%] right-[15%] text-white/15 animate-float" style={{ animationDelay: '-2s' }}>
          <Sprout size={28} />
        </div>
        <div className="absolute top-[40%] left-[8%] text-white/10 animate-float-slow" style={{ animationDelay: '-4s' }}>
          <Leaf size={20} />
        </div>
        <div className="absolute bottom-[25%] left-[55%] text-white/10 animate-float" style={{ animationDelay: '-1s' }}>
          <Sprout size={22} />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 shadow-lg shadow-black/10">
            <Leaf size={32} className="text-emerald-300" />
          </div>

          <h2 className="text-3xl font-bold text-white font-heading leading-tight">
            Bienvenue sur <span className="text-emerald-300">Composte</span>
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            La marketplace qui connecte les producteurs agricoles congolais aux acheteurs,
           partout dans le pays.
          </p>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '2 000+', label: 'Agriculteurs' },
              { value: '10 000+', label: 'Annonces' },
              { value: '50+', label: 'Départements' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white font-heading">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial quote */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <Quote size={20} className="text-emerald-400/50 mx-auto mb-3" />
            <p className="text-white/75 text-sm italic leading-relaxed">
              &ldquo;Grâce à Composte, j&apos;écoule ma production en un clic. Une vraie
              révolution pour l&apos;agriculture congolaise.&rdquo;
            </p>
            <p className="text-white/50 text-xs mt-3 font-medium">— Paul M., Producteur à Brazzaville</p>
          </div>
        </div>
      </div>

      {/* Right - Conversion-Optimized form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-agrishop-50/50 via-white to-emerald-50/30 px-6 py-12">
        <div
          className={`w-full max-w-sm transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/" className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Composte" width={160} height={48} priority className="h-10 w-auto" />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Heureux de vous revoir</h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative group">
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email"
                  className="w-full h-12 pl-11 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                  placeholder="votre@email.fr"
                />
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</label>
                <button type="button" onClick={() => toast.success('Réinitialisation bientôt disponible')}
                  className="text-xs text-agrishop-600 hover:text-agrishop-700 font-medium transition">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative group">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  className="w-full h-12 pl-11 pr-11 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                  placeholder="••••••••"
                />
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-agrishop-600 focus:ring-agrishop-300 focus:ring-offset-0 transition"
              />
              <span className="text-sm text-slate-600">Se souvenir de moi</span>
            </label>

            {/* CTA */}
            <button
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={17} /> Se connecter</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/80 backdrop-blur-sm px-4 text-slate-400">ou</span>
              </div>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="text-agrishop-600 hover:text-agrishop-700 font-semibold inline-flex items-center gap-1 transition">
                Créer un compte <ArrowRight size={14} />
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 pt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-agrishop-500" /> Données chiffrées
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={13} className="text-agrishop-500" /> Connexion sécurisée
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}