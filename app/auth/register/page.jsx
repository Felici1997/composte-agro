'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Check, X, User, Store, Wrench, ArrowLeft, ArrowRight, UserPlus, Mail, Lock, Phone, MapPin, Leaf, Quote } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { DEPARTEMENTS } from '@/lib/categories'
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
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [localite, setLocalite] = useState('')
  const [departement, setDepartement] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const roles = [
    { value: 'client', label: 'Client', desc: 'Acheter des produits et services', icon: User, color: 'emerald' },
    { value: 'vendeur', label: 'Vendeur', desc: 'Vendre mes produits agricoles', icon: Store, color: 'amber' },
    { value: 'prestataire', label: 'Prestataire', desc: 'Proposer mes services', icon: Wrench, color: 'violet' },
  ]

  const passwordMinLength = password.length >= 6
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const roleColorMap = { emerald: 'emerald', amber: 'amber', violet: 'violet' }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) return toast.error('Veuillez remplir tous les champs')
    if (password !== confirmPassword) return toast.error('Les mots de passe ne correspondent pas')
    if (password.length < 6) return toast.error('Le mot de passe doit contenir au moins 6 caractères')
    if (!telephone.trim()) return toast.error('Le numéro de téléphone est obligatoire')

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role } },
    })
    if (!error && data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, nom_complet: fullName, role,
        telephone: telephone.trim(),
        adresse: adresse.trim(),
        localite: localite.trim(),
        departement: departement.trim(),
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
  const accent = selectedRole ? roleColorMap[selectedRole.color] : 'agrishop'

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center min-h-screen bg-gradient-to-br from-agrishop-900 via-emerald-800 to-agrishop-950">
        <img src="/images/illustrations/online-groceries-bro.svg" alt="" className="absolute inset-0 w-full h-full object-contain p-16 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-agrishop-900/60 via-transparent to-agrishop-900/40" />

        <div className="absolute -top-48 -right-32 w-[600px] h-[600px] bg-white/[0.04] rounded-full animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-400/[0.04] rounded-full animate-blob" style={{ animationDelay: '-6s' }} />

        <div className="absolute top-[20%] left-[10%] text-white/15 animate-float-slow">
          <Leaf size={28} />
        </div>
        <div className="absolute top-[70%] right-[12%] text-white/15 animate-float" style={{ animationDelay: '-2s' }}>
          <Leaf size={24} />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 shadow-lg shadow-black/10">
            <UserPlus size={28} className="text-emerald-300" />
          </div>

          <h2 className="text-3xl font-bold text-white font-heading leading-tight">
            Rejoignez la communauté <span className="text-emerald-300">Composte</span>
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Créez votre compte gratuitement et accédez à des milliers d&apos;annonces,
            produits et services agricoles au Congo.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: 'Gratuit', label: 'Inscription' },
              { value: 'Simple', label: 'Utilisation' },
              { value: 'Rapide', label: 'Publication' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-white font-heading">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <Quote size={20} className="text-emerald-400/50 mx-auto mb-3" />
            <p className="text-white/75 text-sm italic leading-relaxed">
              &ldquo;Je recommande Composte à tous les agriculteurs. La plateforme
              est simple et les résultats sont là.&rdquo;
            </p>
            <p className="text-white/50 text-xs mt-3 font-medium">— Sarah K., Agricultrice à Pointe-Noire</p>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-agrishop-50/50 via-white to-emerald-50/30 px-6 py-12 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="w-full max-w-sm">
          <Link href="/" className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Composte" width={160} height={160} priority className="h-9 w-auto object-contain" />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Créer un compte</h1>
            <p className="text-sm text-slate-500 mt-1.5">Étape {step} sur 3</p>
          </div>

          <div className="flex gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-agrishop-500' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-agrishop-500' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-agrishop-500' : 'bg-slate-200'}`} />
          </div>

          <form onSubmit={handleRegister} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">Vous êtes ?</label>
                  <div className="space-y-2">
                    {roles.map(r => {
                      const Icon = r.icon
                      const isSelected = role === r.value
                      const c = { emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-emerald-200', amber: 'border-amber-500 bg-amber-50 text-amber-700 ring-amber-200', violet: 'border-violet-500 bg-violet-50 text-violet-700 ring-violet-200' }
                      return (
                        <button key={r.value} type="button" onClick={() => setRole(r.value)}
                          className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                            isSelected ? c[r.color] + ' ring-2 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}>
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
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
                  <div className="relative group">
                    <input id="name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                      className="w-full h-12 pl-11 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                      placeholder="Jean Dupont" autoComplete="name" />
                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                  </div>
                </div>

                <button type="button" onClick={() => role && fullName ? setStep(2) : toast.error('Choisissez un rôle et votre nom')}
                  className="w-full h-12 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98]">
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={() => setStep(1)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"><ArrowLeft size={18} /></button>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{selectedRole?.label}</span> · {fullName}
                  </p>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <div className="relative group">
                    <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full h-12 pl-11 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                      placeholder="votre@email.fr" autoComplete="email" />
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe *</label>
                  <div className="relative group">
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                      className="w-full h-12 pl-11 pr-11 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                      placeholder="Au moins 6 caractères" autoComplete="new-password" />
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                    className={`w-full h-12 px-4 text-sm border-2 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:ring-4 ${
                      confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-100/60' : 'border-slate-200 focus:border-agrishop-400 focus:ring-agrishop-100/60 hover:border-slate-300'
                    }`}
                    placeholder="Retaper votre mot de passe" autoComplete="new-password" />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} /> Les mots de passe ne correspondent pas</p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check size={12} /> Mots de passe identiques</p>
                  )}
                </div>

                <button type="button" onClick={() => setStep(3)}
                  disabled={!email || !password || (confirmPassword.length > 0 && password !== confirmPassword)}
                  className="w-full h-12 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100">
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={() => setStep(2)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"><ArrowLeft size={18} /></button>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{selectedRole?.label}</span> · {fullName}
                  </p>
                </div>

                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone *</label>
                  <div className="relative group">
                    <input id="tel" type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} required
                      className="w-full h-12 pl-11 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                      placeholder="+242 XX XXX XXXX" autoComplete="tel" />
                    <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-slate-700 mb-1.5">Adresse</label>
                  <input id="adresse" type="text" value={adresse} onChange={e => setAdresse(e.target.value)}
                    className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                    placeholder="Numéro, rue, quartier" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="localite" className="block text-sm font-medium text-slate-700 mb-1.5">Commune / Ville</label>
                    <div className="relative group">
                      <input id="localite" type="text" value={localite} onChange={e => setLocalite(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
                        placeholder="Ex : Makélékélé" />
                      <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-agrishop-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="departement" className="block text-sm font-medium text-slate-700 mb-1.5">Département</label>
                    <select id="departement" value={departement} onChange={e => setDepartement(e.target.value)}
                      className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300">
                      <option value="">Sélectionner</option>
                      {DEPARTEMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inscription...</span>
                  ) : (
                    <span className="flex items-center gap-2"><UserPlus size={17} /> Créer mon compte</span>
                  )}
                </button>
              </div>
            )}

            <div className="relative mt-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white/80 backdrop-blur-sm px-4 text-slate-400">ou</span></div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Déjà un compte ? <Link href="/auth/login" className="text-agrishop-600 hover:text-agrishop-700 font-semibold inline-flex items-center gap-1 transition">Se connecter <ArrowRight size={14} /></Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}