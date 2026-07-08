'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEPARTEMENTS } from '@/lib/categories'
import { Save } from 'lucide-react'

const roles = [
  { value: 'acheteur', label: 'Acheteur' },
  { value: 'vendeur', label: 'Vendeur' },
  { value: 'prestataire', label: 'Prestataire' },
  { value: 'admin', label: 'Admin' },
]

export function UserForm({ user }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    nom_complet: user?.nom_complet || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    role: user?.role || 'acheteur',
    departement: user?.departement || '',
    localite: user?.localite || '',
    bio: user?.bio || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
      router.push('/admin/utilisateurs')
      router.refresh()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
          <input type="text" name="nom_complet" value={form.nom_complet} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
          <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400">
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Département</label>
          <select name="departement" value={form.departement} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400">
            <option value="">—</option>
            {DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Localité</label>
          <input type="text" name="localite" value={form.localite} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-agrishop-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-agrishop-700 transition disabled:opacity-50">
          <Save size={16} />
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 transition">
          Annuler
        </button>
      </div>
    </form>
  )
}
