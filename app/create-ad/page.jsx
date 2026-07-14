'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Info, ShoppingBag, Package, Wrench, MapPin, Calendar, AlertTriangle, CheckCircle, Briefcase, Search, DollarSign, Box } from 'lucide-react'
import { categories, regions } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

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
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (!p) { setNotFound(true); return }
      setProfile(p)
    })
  }, [router])

  const role = profile?.role || 'client'
  const isProduct = role === 'vendeur'
  const isService = role === 'prestataire'
  const isListing = role === 'client'
  const stockZero = isProduct && form.stock_actuel === '0'

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
    const required = ['title', 'description', 'category_id', 'city', 'region']
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
        if (uploadError) {
          toast.error(`Upload échoué : ${uploadError.message}. Vérifiez les permissions du bucket.`)
        } else {
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
      const label = isListing ? 'Annonce' : isProduct ? 'Produit' : 'Service'
      toast.success(`${label} publié${isService ? '' : 'e'} avec succès !`)
      router.push(isProduct ? '/dashboard' : '/')
      router.refresh()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication')
    } finally {
      setLoading(false)
    }
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-slate-300" />
        </div>
        <h1 className="text-xl text-slate-500 font-medium">Profil introuvable</h1>
        <p className="text-sm text-slate-400 mt-1">Complétez votre profil avant de publier</p>
        <button onClick={() => router.push('/profile')} className="mt-6 text-sm text-agrishop-600 hover:underline font-medium">Aller à mon profil</button>
      </div>
    )
  }

  // ─────────────────────────────────────────────────
  // FORMULAIRE CLIENT — Annonce classifiée
  // ─────────────────────────────────────────────────
  if (isListing) return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShoppingBag size={24} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Déposer une annonce</h1>
        <p className="text-sm text-slate-400 mt-1">Publiez une offre ou une demande agricole</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Photos <span className="text-slate-400 font-normal">({images.length}/8 max)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition">
                <Upload size={22} />
                <span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        {/* Titre */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre de l&apos;annonce *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            placeholder="Ex: Recherche tracteur pour labour, Vente de poulets de chair..." />
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none"
            placeholder="Décrivez votre annonce en détail : quantité, qualité, disponibilité..." />
        </div>

        {/* Catégorie + Prix */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white">
                <option value="">Sélectionnez</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Prix <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={1}
                  className="w-full pl-16 pr-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Unité <span className="text-slate-400 font-normal">(optionnel)</span>
            </label>
            <input name="unit" value={form.unit} onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              placeholder="Ex: kg, sac 25kg, tête, caisse..." />
          </div>
        </div>

        {/* Pré-vente */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input type="checkbox" name="is_pre_sale" checked={form.is_pre_sale} onChange={handleChange} id="is_pre_sale"
                className="sr-only" />
              <div onClick={() => setForm(prev => ({ ...prev, is_pre_sale: !prev.is_pre_sale }))}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${form.is_pre_sale ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${form.is_pre_sale ? 'translate-x-5.5' : 'translate-x-0.5'}`} style={{left: 0}} />
              </div>
            </div>
            <div>
              <label htmlFor="is_pre_sale" className="text-sm font-medium text-slate-700 cursor-pointer">Pré-vente</label>
              <p className="text-xs text-slate-400">Récolte à venir, commandez avant la récolte</p>
            </div>
          </div>
          {form.is_pre_sale && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Calendar size={14} className="inline mr-1" /> Date de récolte estimée
              </label>
              <input type="date" name="harvest_date" value={form.harvest_date} onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            </div>
          )}
        </div>

        {/* Localisation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            <select name="region" value={form.region} onChange={handleChange} required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white">
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publication...</span> : <><ShoppingBag size={16} /> Publier mon annonce</>}
        </button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Info size={12} /> En publiant, vous acceptez nos conditions d&apos;utilisation
        </p>
      </form>
    </div>
  )

  // ─────────────────────────────────────────────────
  // FORMULAIRE VENDEUR — Catalogue produit
  // ─────────────────────────────────────────────────
  if (isProduct) return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Package size={24} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Ajouter un produit</h1>
        <p className="text-sm text-slate-400 mt-1">Ajoutez un produit à votre catalogue de vente</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Photos <span className="text-slate-400 font-normal">({images.length}/8 max)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition">
                <Upload size={22} />
                <span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        {/* Nom du produit */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du produit *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            placeholder="Ex: Foin de qualité, Sac de maïs 25kg..." />
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none"
            placeholder="Décrivez votre produit : variété, qualité, origine, mode de production..." />
        </div>

        {/* Catégorie + Prix */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white">
                <option value="">Sélectionnez</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix unitaire *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min={1} step={1}
                  className="w-full pl-16 pr-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unité de mesure *</label>
              <input name="unit" value={form.unit} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                placeholder="Ex: kg, sac 25kg, ballot..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Box size={14} className="inline mr-1" /> Stock initial
              </label>
              <div className="relative">
                <input type="number" name="stock_actuel" value={form.stock_actuel} onChange={handleChange} min={0}
                  className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 transition ${
                    stockZero ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100 bg-amber-50' : 'border-slate-300 focus:border-emerald-400 focus:ring-emerald-100'
                  }`} placeholder="0" />
                {stockZero && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <AlertTriangle size={14} /> Rupture
                  </div>
                )}
              </div>
              {stockZero && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={11} /> Le produit sera publié mais marqué comme en rupture de stock
                </p>
              )}
              {!stockZero && form.stock_actuel !== '' && parseInt(form.stock_actuel) > 0 && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={11} /> En stock
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            <select name="region" value={form.region} onChange={handleChange} required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white">
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Ajout...</span> : <><Package size={16} /> Ajouter au catalogue</>}
        </button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Info size={12} /> En publiant, vous acceptez nos conditions d&apos;utilisation
        </p>
      </form>
    </div>
  )

  // ─────────────────────────────────────────────────
  // FORMULAIRE PRESTATAIRE — Carte de service pro
  // ─────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Wrench size={24} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Proposer un service</h1>
        <p className="text-sm text-slate-400 mt-1">Offrez vos compétences aux agriculteurs et professionnels</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de service */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Type de service *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: 'prestation', label: 'Prestation de service', desc: 'Je propose mes compétences', icon: Briefcase },
              { value: 'recherche', label: 'Recherche prestataire', desc: 'Je cherche un professionnel', icon: Search },
            ].map(t => {
              const isActive = form.type_service === t.value
              const Icon = t.icon
              return (
                <button key={t.value} type="button" onClick={() => setForm(prev => ({ ...prev, type_service: t.value }))}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition ${
                    isActive ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{t.label}</p>
                    <p className={`text-xs mt-0.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>{t.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Titre */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du service *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            placeholder={form.type_service === 'recherche' ? 'Ex: Recherche un tractoriste pour labour' : 'Ex: Service de labour mécanisé'} />
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none"
            placeholder="Décrivez votre service : compétences, expérience, disponibilités, zone d'intervention..." />
        </div>

        {/* Tarif + Unité */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <DollarSign size={14} className="inline mr-1" /> Tarif <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={1}
                  className="w-full pl-16 pr-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Unité <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input name="unit" value={form.unit} onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                placeholder="Ex: heure, jour, forfait..." />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            <select name="region" value={form.region} onChange={handleChange} required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white">
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Photos <span className="text-slate-400 font-normal">({images.length}/8 max, optionnel)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition">
                <Upload size={22} />
                <span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <button disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publication...</span> : <><Wrench size={16} /> Publier le service</>}
        </button>

        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
          <Info size={12} /> En publiant, vous acceptez nos conditions d&apos;utilisation
        </p>
      </form>
    </div>
  )
}
