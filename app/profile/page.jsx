'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User, Mail, Phone, Shield, Save, ArrowLeft, Eye, Package, ShoppingBag, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nomComplet, setNomComplet] = useState('')
  const [telephone, setTelephone] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      setProfile(p)
      setNomComplet(p?.nom_complet || '')
      setTelephone(p?.telephone || '')
      setLoading(false)
    }
    load()
  }, [router])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      nom_complet: nomComplet.trim(),
      telephone: telephone.trim(),
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
          <div className="h-48 bg-slate-100 rounded-2xl" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  const roleLabel = profile?.role === 'vendeur' ? 'Vendeur' : profile?.role === 'prestataire' ? 'Prestataire' : 'Client'
  const roleColor = profile?.role === 'vendeur' ? 'emerald' : profile?.role === 'prestataire' ? 'purple' : 'agrishop'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition">
        <ArrowLeft size={16} /> Retour au tableau de bord
      </Link>

      <div className={`relative overflow-hidden bg-gradient-to-br from-${roleColor}-600 to-${roleColor}-800 rounded-2xl p-6 md:p-8 mb-6 text-white`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
            {(profile?.nom_complet || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-2">
              <User size={12} /> {roleLabel}
            </div>
            <h1 className="text-xl font-bold">{profile?.nom_complet || 'Mon profil'}</h1>
            <p className="text-sm text-white/70">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-slate-800">—</p>
          <p className="text-xs text-slate-400">Annonces</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-slate-800">—</p>
          <p className="text-xs text-slate-400">Vues</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-slate-800">—</p>
          <p className="text-xs text-slate-400">Favoris</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <User size={18} /> Informations personnelles
        </h2>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
            <Mail size={14} /> Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-400 bg-slate-50 outline-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
            <User size={14} /> Nom complet
          </label>
          <input
            type="text"
            value={nomComplet}
            onChange={e => setNomComplet(e.target.value)}
            placeholder="Votre nom et prénom"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
            <Phone size={14} /> Téléphone
          </label>
          <input
            type="tel"
            value={telephone}
            onChange={e => setTelephone(e.target.value)}
            placeholder="+242 XX XXX XXXX"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
            <Shield size={14} /> Rôle
          </label>
          <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500">
            <span className={`w-2 h-2 rounded-full bg-${roleColor}-500`} />
            {roleLabel}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-1.5 bg-agrishop-600 hover:bg-agrishop-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
