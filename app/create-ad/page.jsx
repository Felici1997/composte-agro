'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, X, Info, ShoppingBag, Package, Wrench } from 'lucide-react'
import { categories, regions } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const contentTypes = [
  { value: 'listing', label: 'Annonce classique', desc: 'Véhicule, matériel, animal, terrain...', icon: ShoppingBag },
  { value: 'product', label: 'Produit / Stock', desc: 'Vente avec stock (semences, foin, fruits...)', icon: Package },
  { value: 'service', label: 'Service / Emploi', desc: 'Prestation, service, offre d\'emploi', icon: Wrench },
]

export default function CreateAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [contentType, setContentType] = useState('listing')
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    unit: '',
    category_id: '',
    city: '',
    region: '',
    phoneVisible: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024
    const filtered = files.filter(f => {
      if (!validTypes.includes(f.type)) { toast.error(`${f.name} : format non accepté (JPEG, PNG, WebP, GIF uniquement)`); return false }
      if (f.size > maxSize) { toast.error(`${f.name} : trop volumineux (max 5 Mo)`); return false }
      return true
    })
    setImages(prev => [...prev, ...filtered].slice(0, 8))
  }

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category_id || !form.city || !form.region) {
      return toast.error('Veuillez remplir tous les champs obligatoires')
    }
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Vous devez être connecté pour déposer une annonce')
        router.push('/auth/login')
        return
      }

      let uploadedUrl = ''
      if (images.length > 0) {
        const ext = images[0].name.split('.').pop()
        const fileName = `${session.user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(fileName, images[0])
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(fileName)
          uploadedUrl = publicUrl
        }
      }

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          title: form.title,
          description: form.description,
          price: form.price,
          unit: form.unit,
          category_id: form.category_id,
          city: form.city,
          region: form.region,
          image_url: uploadedUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la publication')
      toast.success('Annonce publiée avec succès !')
      router.push('/')
      router.refresh()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication')
    } finally {
      setLoading(false)
    }
  }

  function regionToDept(regionName) {
    const r = regions.find(r => r.nom === regionName)
    return r ? r.departements[0] : regionName
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-composte-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Upload size={20} className="text-composte-600" />
        </div>
        <h1 className="text-xl font-semibold text-slate-700">Déposer une annonce</h1>
        <p className="text-sm text-slate-400 mt-1">Publiez votre annonce agricole gratuitement</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Type d'annonce</label>
          <div className="grid grid-cols-3 gap-2">
            {contentTypes.map(ct => {
              const Icon = ct.icon
              return (
                <button key={ct.value} type="button" onClick={() => setContentType(ct.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition ${
                    contentType === ct.value
                      ? 'border-composte-500 bg-composte-50 text-composte-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  <Icon size={20} />
                  <span className="text-xs font-medium">{ct.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Photos <span className="text-slate-400 font-normal">({images.length}/8 max)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-composte-400 hover:bg-composte-50 text-slate-400 hover:text-composte-600 transition">
                <Upload size={20} />
                <span className="text-[10px] mt-0.5">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition"
            placeholder="Ex: Tracteur John Deere 6120M - 2020" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition resize-none"
            placeholder="Décrivez votre annonce en détail..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie *</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 bg-white">
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prix <span className="text-slate-400 font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">FCFA</span>
              <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={1}
                className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 focus:ring-1 focus:ring-composte-200 transition" />
            </div>
          </div>
        </div>

        {contentType === 'product' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unité de mesure</label>
            <input name="unit" value={form.unit} onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 transition"
              placeholder="Ex: kg, sac 25kg, ballot, caisse..." />
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Localisation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 transition" />
            </div>
            <div>
              <select name="region" value={form.region} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-composte-400 bg-white">
                <option value="">Département *</option>
                {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button disabled={loading}
          className="w-full bg-composte-600 hover:bg-composte-700 disabled:bg-composte-400 text-white font-medium py-3 rounded-lg transition text-sm">
          {loading ? 'Publication en cours...' : 'Publier mon annonce'}
        </button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Info size={12} /> En publiant, vous acceptez nos conditions
        </p>
      </form>
    </div>
  )
}
