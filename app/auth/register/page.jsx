'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Eye, EyeOff, Check, X, User, Store, Wrench } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('client')
  const [loading, setLoading] = useState(false)

  const roles = [
    { value: 'client', label: 'Client', desc: 'Je veux acheter', icon: User },
    { value: 'vendeur', label: 'Vendeur', desc: 'Je veux vendre mes produits', icon: Store },
    { value: 'prestataire', label: 'Prestataire', desc: 'Je propose des services', icon: Wrench },
  ]

  const passwordMinLength = password.length >= 6
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) return toast.error('Veuillez remplir tous les champs')
    if (password !== confirmPassword) return toast.error('Les mots de passe ne correspondent pas')
    if (password.length < 6) return toast.error('Le mot de passe doit contenir au moins 6 caractères')

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role } },
    })
    if (!error && data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        nom_complet: fullName,
        role,
      }, { onConflict: 'id' })
    }
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Inscription réussie ! Vérifiez votre email puis connectez-vous.')
      router.push('/auth/login')
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
          <h1 className="text-xl font-semibold text-slate-700">Créer un compte</h1>
          <p className="text-sm text-slate-500 mt-1">Rejoignez la communauté agricole Composte</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet *</label>
            <input id="name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
              placeholder="Jean Dupont" autoComplete="name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Vous êtes ?</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => {
                const Icon = r.icon
                return (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition ${
                      role === r.value
                        ? 'border-composte-500 bg-composte-50 text-composte-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>
                    <Icon size={18} />
                    <span className="text-xs font-medium">{r.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{r.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
            <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
              placeholder="votre@email.fr" autoComplete="email" />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe *</label>
            <div className="relative">
              <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
                placeholder="Au moins 6 caractères" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {passwordMinLength ? <Check size={12} className="text-green-500" /> : <X size={12} className="text-slate-300" />}
                <span className={`text-xs ${passwordMinLength ? 'text-green-600' : 'text-slate-400'}`}>6 caractères minimum</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe *</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-1 transition
                ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-composte-400 focus:ring-composte-200'}`}
              placeholder="Retaper votre mot de passe" autoComplete="new-password" />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <button disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
            className="w-full bg-composte-600 hover:bg-composte-700 disabled:bg-composte-400 text-white font-medium py-2.5 rounded-lg transition text-sm">
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Déjà un compte ? <Link href="/auth/login" className="text-composte-600 hover:underline font-medium">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
