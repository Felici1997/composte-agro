'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEPARTEMENTS, getCategoryIdByName } from '@/lib/categories'
import { Save } from 'lucide-react'

const categories = ['ÉLEVAGE', 'AGRICULTURE', 'INTRANTS', 'ÉQUIPEMENTS', 'TRANSFORMATION', 'SERVICES']

export function ProductForm({ initialData, productId }) {
  const router = useRouter()
  const isEdit = !!productId
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    nom: initialData?.nom || '',
    description: initialData?.description || '',
    prix_unitaire: initialData?.prix_unitaire || '',
    category: initialData?.category || '',
    departement: initialData?.departement || '',
    localite: initialData?.localite || '',
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active ?? true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { category, ...rest } = form
      const payload = {
        ...rest,
        prix_unitaire: parseFloat(form.prix_unitaire) || 0,
        category_id: getCategoryIdByName(category),
      }
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde')
      router.push('/admin/produits')
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
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom du produit</label>
        <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prix unitaire (FCFA)</label>
          <input type="number" name="prix_unitaire" value={form.prix_unitaire} onChange={handleChange} min={0} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400">
            <option value="">—</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
        <label className="block text-sm font-medium text-slate-700 mb-1">URL image</label>
        <input type="url" name="image_url" value={form.image_url} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-agrishop-400" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="rounded border-slate-300 text-agrishop-600 focus:ring-agrishop-400" />
        Produit actif (visible sur le site)
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-agrishop-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-agrishop-700 transition disabled:opacity-50">
          <Save size={16} />
          {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 transition">
          Annuler
        </button>
      </div>
    </form>
  )
}
