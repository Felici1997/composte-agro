'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Eye, EyeOff } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-composte-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-3">
            <Leaf size={32} className="text-composte-600" />
            <span className="text-2xl font-semibold text-slate-800">composte<span className="text-composte-600">.</span></span>
          </Link>
          <h1 className="text-xl font-semibold text-slate-700">Bienvenue</h1>
          <p className="text-sm text-slate-500 mt-1">Connectez-vous à votre compte Composte</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
              placeholder="votre@email.fr" autoComplete="email" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mot de passe</label>
              <button type="button" onClick={() => toast.success('Réinitialisation bientôt disponible')}
                className="text-xs text-composte-600 hover:underline">Mot de passe oublié ?</button>
            </div>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
                placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-composte-600 hover:bg-composte-700 disabled:bg-composte-400 text-white font-medium py-2.5 rounded-lg transition text-sm">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">ou</span></div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ? <Link href="/auth/register" className="text-composte-600 hover:underline font-medium">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
