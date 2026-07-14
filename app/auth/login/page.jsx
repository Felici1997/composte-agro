'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, ArrowRight, Shield, Mail } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen flex">
      {/* Left - decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-agrishop-900/85 via-agrishop-800/75 to-emerald-900/85" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Right - login form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-agrishop-50 via-white to-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-4">
              <Image src="/logo.svg" alt="Composte" width={160} height={48} priority className="h-10 w-auto" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Heureux de vous revoir</h1>
            <p className="text-sm text-slate-500 mt-1">Connectez-vous pour accéder à votre espace</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-agrishop-400 focus:ring-2 focus:ring-agrishop-100 transition placeholder-slate-400"
                  placeholder="votre@email.fr" autoComplete="email" />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mot de passe</label>
                <button type="button" onClick={() => toast.success('Réinitialisation bientôt disponible')}
                  className="text-xs text-agrishop-600 hover:text-agrishop-700 font-medium">Mot de passe oublié ?</button>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-agrishop-400 focus:ring-2 focus:ring-agrishop-100 transition placeholder-slate-400"
                  placeholder="••••••••" autoComplete="current-password" />
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition" aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-agrishop-600 hover:bg-agrishop-700 disabled:bg-agrishop-400 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connexion...</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={16} /> Se connecter</span>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">ou</span></div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Pas encore de compte ? <Link href="/auth/register" className="text-agrishop-600 hover:text-agrishop-700 font-semibold inline-flex items-center gap-0.5">S'inscrire <ArrowRight size={14} /></Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
