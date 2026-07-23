'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User, Mail, Phone, MapPin, Shield, Save, ArrowLeft, Eye, Package, ShoppingBag, ClipboardList, RefreshCw, Leaf } from 'lucide-react'
import { DEPARTEMENTS } from '@/lib/categories'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [nomComplet, setNomComplet] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [localite, setLocalite] = useState('')
  const [departement, setDepartement] = useState('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      setProfile(p)
      setNomComplet(p?.nom_complet || '')
      setTelephone(p?.telephone || '')
      setAdresse(p?.adresse || '')
      setLocalite(p?.localite || '')
      setDepartement(p?.departement || '')
      setLoading(false)
    }
    load()
  }, [router])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      nom_complet: nomComplet.trim(), telephone: telephone.trim(),
      adresse: adresse.trim(), localite: localite.trim(), departement: departement.trim(),
    }).eq('id', user.id)
    setSaving(false)
    if (error) return toast.error('Erreur lors de la sauvegarde')
    toast.success('Profil mis à jour')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-56 bg-slate-100 rounded-2xl" />
          <div className="h-80 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  const roleLabel = profile?.role === 'vendeur' ? 'Vendeur' : profile?.role === 'prestataire' ? 'Prestataire' : 'Client'
  const roleColor = profile?.role === 'vendeur' ? 'emerald' : profile?.role === 'prestataire' ? 'violet' : 'agrishop'
  const gradient = profile?.role === 'vendeur' ? 'from-emerald-600 via-emerald-700 to-green-800' : profile?.role === 'prestataire' ? 'from-violet-600 via-violet-700 to-indigo-800' : 'from-agrishop-600 via-agrishop-700 to-emerald-800'

  return (
    <div className={`min-h-screen bg-gradient-to-b from-agrishop-50/30 via-white to-emerald-50/20 pb-10 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link           href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-all duration-200 hover:gap-2">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {/* Profile hero with illustration */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl`}>
          <img src="/images/illustrations/peach-bro.svg" alt="" className="absolute right-0 top-0 h-full w-auto object-contain opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg shadow-black/10">
              {(profile?.nom_complet || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-2">
                <User size={12} /> {roleLabel}
              </div>
              <h1 className="text-xl font-bold font-heading">{profile?.nom_complet || 'Mon profil'}</h1>
              <p className="text-sm text-white/70">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-sm transition-all duration-200">
            <p className="text-lg font-bold text-slate-800">—</p>
            <p className="text-xs text-slate-400">Annonces</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-sm transition-all duration-200">
            <p className="text-lg font-bold text-slate-800">—</p>
            <p className="text-xs text-slate-400">Vues</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-sm transition-all duration-200">
            <p className="text-lg font-bold text-slate-800">—</p>
            <p className="text-xs text-slate-400">Favoris</p>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 font-heading">
            <User size={18} /> Informations personnelles
          </h2>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
              <Mail size={14} /> Email
            </label>
            <input type="email" value={user?.email || ''} disabled
              className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl text-slate-400 bg-slate-50/50 outline-none cursor-not-allowed" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
              <User size={14} /> Nom complet
            </label>
            <input type="text" value={nomComplet} onChange={e => setNomComplet(e.target.value)}
              placeholder="Votre nom et prénom"
              className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
              <Phone size={14} /> Téléphone
            </label>
            <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)}
              placeholder="+242 XX XXX XXXX"
              className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">Adresse</label>
            <input type="text" value={adresse} onChange={e => setAdresse(e.target.value)}
              placeholder="Numéro, rue, quartier"
              className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
                <MapPin size={14} /> Commune / Ville
              </label>
              <input type="text" value={localite} onChange={e => setLocalite(e.target.value)}
                placeholder="Ex : Makélékélé"
                className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
                <MapPin size={14} /> Département
              </label>
              <select value={departement} onChange={e => setDepartement(e.target.value)}
                className="w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300">
                <option value="">Sélectionner</option>
                {DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
              <Shield size={14} /> Rôle
            </label>
            <div className="flex items-center gap-2.5 h-12 px-4 border-2 border-slate-200 rounded-2xl text-sm bg-slate-50/50 text-slate-500">
              <span className={`w-2.5 h-2.5 rounded-full bg-${roleColor}-500`} />
              {roleLabel}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full h-12 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100">
            <Save size={16} /> {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
          </button>

          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('restart-tour'))}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-agrishop-600 transition-all duration-200 py-2 rounded-xl hover:bg-agrishop-50">
            <RefreshCw size={14} /> Revoir le tutoriel
          </button>
        </form>
      </div>
    </div>
  )
}