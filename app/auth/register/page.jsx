'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Check, X, User, Store, Wrench, ArrowLeft, ArrowRight, UserPlus, Mail, Lock } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    { value: 'client', label: 'Client', desc: 'Acheter des produits et services', icon: User, color: 'emerald' },
    { value: 'vendeur', label: 'Vendeur', desc: 'Vendre mes produits agricoles', icon: Store, color: 'amber' },
    { value: 'prestataire', label: 'Prestataire', desc: 'Proposer mes services', icon: Wrench, color: 'purple' },
  ]

  const passwordMinLength = password.length >= 6
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const canProceed = role && fullName.length > 0
  const colorMap = { emerald: 'emerald', amber: 'amber', purple: 'violet' }

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
        id: data.user.id, email, nom_complet: fullName, role,
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

  const selectedRole = roles.find(r => r.value === role)
  const accentColor = selectedRole ? colorMap[selectedRole.color] : 'composte'

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-composte-600 to-green-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
            <UserPlus size={44} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">Rejoignez la communauté</h2>
          <p className="text-emerald-100 mt-4 leading-relaxed">Créez votre compte en quelques clics et accédez à toutes les fonctionnalités de Composte.</p>
          <div className="space-y-4 mt-10 text-left">
            {[
              { icon: Store, text: 'Publiez des annonces gratuitement' },
              { icon: User, text: 'Achetez en direct aux producteurs' },
              { icon: Wrench, text: 'Trouvez des prestataires près de chez vous' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-white" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-composte-50 via-white to-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="Composte" width={160} height={48} priority className="h-10 w-auto" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Créer un compte</h1>
            <p className="text-sm text-slate-500 mt-1">Étape {step} sur 2</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full transition ${step >= 1 ? 'bg-composte-500' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition ${step >= 2 ? 'bg-composte-500' : 'bg-slate-200'}`} />
          </div>

          <form onSubmit={handleRegister} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">Vous êtes ?</label>
                  <div className="space-y-2">
                    {roles.map(r => {
                      const Icon = r.icon
                      const isSelected = role === r.value
                      const colors = { emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-emerald-200', amber: 'border-amber-500 bg-amber-50 text-amber-700 ring-amber-200', purple: 'border-violet-500 bg-violet-50 text-violet-700 ring-violet-200' }
                      return (
                        <button key={r.value} type="button" onClick={() => setRole(r.value)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                            isSelected ? colors[r.color] + ' ring-2' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/60' : 'bg-slate-50'
                          }`}>
                            <Icon size={20} className={isSelected ? '' : 'text-slate-400'} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${isSelected ? '' : 'text-slate-700'}`}>{r.label}</p>
                            <p className={`text-xs ${isSelected ? 'opacity-80' : 'text-slate-400'}`}>{r.desc}</p>
                          </div>
                          {isSelected && <Check size={18} className="shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet *</label>
                  <div className="relative">
                    <input id="name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-composte-400 focus:ring-2 focus:ring-composte-100 transition placeholder-slate-400"
                      placeholder="Jean Dupont" autoComplete="name" />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button type="button" onClick={() => role && fullName ? setStep(2) : toast.error('Choisissez un rôle et votre nom')}
                  className="w-full bg-composte-600 hover:bg-composte-700 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-composte-200">
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={() => setStep(1)} className="p-1 text-slate-400 hover:text-slate-600 transition"><ArrowLeft size={18} /></button>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{selectedRole?.label}</span> · {fullName}
                  </p>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-composte-400 focus:ring-2 focus:ring-composte-100 transition placeholder-slate-400"
                      placeholder="votre@email.fr" autoComplete="email" />
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe *</label>
                  <div className="relative">
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-composte-400 focus:ring-2 focus:ring-composte-100 transition placeholder-slate-400"
                      placeholder="Au moins 6 caractères" autoComplete="new-password" />
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
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
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 transition placeholder-slate-400 ${
                      confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-composte-400 focus:ring-composte-100'
                    }`}
                    placeholder="Retaper votre mot de passe" autoComplete="new-password" />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} /> Les mots de passe ne correspondent pas</p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check size={12} /> Mots de passe identiques</p>
                  )}
                </div>

                <button disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
                  className="w-full bg-composte-600 hover:bg-composte-700 disabled:bg-composte-400 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-composte-200">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inscription...</span>
                  ) : (
                    <span className="flex items-center gap-2"><UserPlus size={16} /> Créer mon compte</span>
                  )}
                </button>
              </div>
            )}

            <div className="relative mt-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">ou</span></div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Déjà un compte ? <Link href="/auth/login" className="text-composte-600 hover:text-composte-700 font-semibold inline-flex items-center gap-0.5">Se connecter <ArrowRight size={14} /></Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
