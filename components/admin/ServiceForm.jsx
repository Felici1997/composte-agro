'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEPARTEMENTS } from '@/lib/categories'
import { Save } from 'lucide-react'

const typesService = ['Labour', 'Semis', 'Récolte', 'Transport', 'Conseil', 'Maintenance', 'Pulvérisation', 'Irrigation', 'Autre']

export function ServiceForm({ initialData, serviceId }) {
  const router = useRouter()
  const isEdit = !!serviceId
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    titre: initialData?.titre || '',
    type_service: initialData?.type_service || '',
    description: initialData?.description || '',
    tarif_base: initialData?.tarif_base || '',
    departement: initialData?.departement || '',
    localite: initialData?.localite || '',
    est_disponible: initialData?.est_disponible ?? true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tarif_base: parseFloat(form.tarif_base) || 0,
      }
      const res = await fetch('/api/admin/services', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId, ...payload }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
      router.push('/admin/services')
      router.refresh()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Titre du service</label>
        <input type="text" name="titre" value={form.titre} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type de service</label>
          <select name="type_service" value={form.type_service} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400">
            <option value="">—</option>
            {typesService.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tarif de base (FCFA)</label>
          <input type="number" name="tarif_base" value={form.tarif_base} onChange={handleChange} min={0} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
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
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="est_disponible" checked={form.est_disponible} onChange={handleChange} className="rounded border-slate-300 text-agrishop-600 focus:ring-agrishop-400" />
        Service disponible
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-agrishop-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-agrishop-700 transition disabled:opacity-50">
          <Save size={16} />
          {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le service'}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 transition">
          Annuler
        </button>
      </div>
    </form>
  )
}
