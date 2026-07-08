'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Info, ShoppingBag, Package, Wrench, User, Store, Sprout } from 'lucide-react'
import { categories, regions } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const roleConfig = {
  client: {
    label: 'Annonce',
    desc: 'Publiez une demande ou une offre agricole',
    icon: ShoppingBag,
    table: 'listings',
    color: 'agrishop',
    fields: ['title', 'description', 'price', 'unit', 'category_id', 'image_url', 'is_pre_sale', 'harvest_date'],
  },
  vendeur: {
    label: 'Produit',
    desc: 'Ajoutez un produit à votre catalogue',
    icon: Package,
    table: 'products',
    color: 'emerald',
    fields: ['nom', 'description', 'prix_unitaire', 'unite_mesure', 'category_id', 'stock_actuel', 'image_url'],
  },
  prestataire: {
    label: 'Service',
    desc: 'Proposez un service aux clients',
    icon: Wrench,
    table: 'services',
    color: 'purple',
    fields: ['titre', 'description', 'tarif_base', 'type_service', 'est_disponible'],
  },
}

export default function CreateAdPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    unit: '',
    category_id: '',
    city: '',
    region: '',
    is_pre_sale: false,
    harvest_date: '',
    stock_actuel: '1',
    type_service: 'prestation',
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      setProfile(p)
    })
  }, [router])

  const role = profile?.role || 'client'
  const config = roleConfig[role] || roleConfig.client
  const isProduct = role === 'vendeur'
  const isService = role === 'prestataire'
  const isListing = role === 'client'
  const accentColor = config.color

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
    const required = ['title', 'description', 'category_id']
    if (isListing && !form.city) required.push('city')
    if (isListing && !form.region) required.push('region')
    if (isProduct && !form.city) required.push('city')
    if (isProduct && !form.region) required.push('region')

    for (const field of required) {
      if (!form[field]) return toast.error('Veuillez remplir tous les champs obligatoires')
    }
    setLoading(true)

    try {
      let uploadedUrl = ''
      if (images.length > 0) {
        const ext = images[0].name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('listing')
          .upload(fileName, images[0])
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('listing').getPublicUrl(fileName)
          uploadedUrl = publicUrl
        }
      }

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          title: form.title,
          description: form.description,
          price: form.price,
          unit: form.unit,
          category_id: form.category_id,
          city: form.city,
          region: form.region,
          image_url: uploadedUrl,
          is_pre_sale: form.is_pre_sale,
          harvest_date: form.harvest_date,
          stock_actuel: form.stock_actuel ? parseInt(form.stock_actuel) : 1,
          type_service: form.type_service,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la publication')
      toast.success(`${config.label} publié${isService ? '' : 'e'} avec succès !`)
      router.push('/')
      router.refresh()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className={`w-12 h-12 bg-${accentColor}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
          {isListing && <ShoppingBag size={20} className={`text-${accentColor}-600`} />}
          {isProduct && <Package size={20} className={`text-${accentColor}-600`} />}
          {isService && <Wrench size={20} className={`text-${accentColor}-600`} />}
        </div>
        <h1 className="text-xl font-semibold text-slate-700">
          {isListing ? 'Déposer une annonce' : isProduct ? 'Ajouter un produit' : 'Proposer un service'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">{config.desc}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        {/* Role badge */}
        <div className={`flex items-center gap-2 text-xs font-medium text-${accentColor}-700 bg-${accentColor}-50 px-3 py-2 rounded-lg`}>
          <User size={14} />
          Vous publiez en tant que <strong>{role === 'client' ? 'Client' : role === 'vendeur' ? 'Vendeur' : 'Prestataire'}</strong>
        </div>

        {/* Images */}
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
              <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-agrishop-400 hover:bg-agrishop-50 text-slate-400 hover:text-agrishop-600 transition">
                <Upload size={20} />
                <span className="text-[10px] mt-0.5">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {isService ? 'Titre du service *' : 'Titre *'}
          </label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition"
            placeholder={isListing ? 'Ex: Recherche tracteur pour labour' : isProduct ? 'Ex: Foin de qualité, sac 25kg' : 'Ex: Service de labour mécanisé'} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition resize-none"
            placeholder="Décrivez votre annonce en détail..." />
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie *</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 bg-white">
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
                className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition" />
            </div>
          </div>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Unité <span className="text-slate-400 font-normal">(optionnel)</span>
          </label>
          <input name="unit" value={form.unit} onChange={handleChange}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 transition"
            placeholder={isProduct ? 'Ex: kg, sac 25kg, ballot, caisse...' : 'Ex: heure, jour, forfait...'} />
        </div>

        {/* Product-specific fields */}
        {isProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock initial</label>
              <input type="number" name="stock_actuel" value={form.stock_actuel} onChange={handleChange} min={1}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition" />
            </div>
          </div>
        )}

        {/* Service-specific fields */}
        {isService && (
          <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">Type de service</label>
            <div className="flex gap-2">
              {[
                { value: 'prestation', label: 'Prestation' },
                { value: 'recherche', label: 'Recherche prestataire' },
              ].map(t => (
                <button key={t.value} type="button" onClick={() => setForm(prev => ({ ...prev, type_service: t.value }))}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition ${
                    form.type_service === t.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listing-specific fields */}
        {isListing && (
          <div className="p-4 bg-agrishop-50/50 rounded-lg border border-agrishop-100 space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="is_pre_sale" checked={form.is_pre_sale} onChange={handleChange} id="is_pre_sale"
                className="w-4 h-4 rounded border-slate-300 text-agrishop-600 focus:ring-agrishop-200" />
              <label htmlFor="is_pre_sale" className="text-sm text-slate-700">Il s'agit d'une pré-vente (récolte à venir)</label>
            </div>
            {form.is_pre_sale && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date de récolte estimée</label>
                <input type="date" name="harvest_date" value={form.harvest_date} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200 transition" />
              </div>
            )}
          </div>
        )}

        {/* Location */}
        {(isListing || isProduct) && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Localisation</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input name="city" value={form.city} onChange={handleChange} required={isListing || isProduct} placeholder="Commune *"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 transition" />
              </div>
              <div>
                <select name="region" value={form.region} onChange={handleChange} required={isListing || isProduct}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-agrishop-400 bg-white">
                  <option value="">Département *</option>
                  {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <button disabled={loading}
          className="w-full bg-agrishop-600 hover:bg-agrishop-700 disabled:bg-agrishop-400 text-white font-medium py-3 rounded-lg transition text-sm">
          {loading ? 'Publication en cours...' : isListing ? 'Publier mon annonce' : isProduct ? 'Ajouter le produit' : 'Publier le service'}
        </button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Info size={12} /> En publiant, vous acceptez nos conditions
        </p>
      </form>
    </div>
  )
}
