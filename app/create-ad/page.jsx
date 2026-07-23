'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, X, Info, ShoppingBag, Package, Wrench, MapPin, Calendar, AlertTriangle, CheckCircle, Briefcase, Search, DollarSign, Box, ArrowRight, Leaf } from 'lucide-react'
import { categories, regions } from '@/lib/categories'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CreateAdPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-agrishop-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <CreateAdForm />
    </Suspense>
  )
}

function CreateAdForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const isEditing = !!editId
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingAd, setLoadingAd] = useState(false)
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', price: '', unit: '', category_id: '',
    city: '', region: '', is_pre_sale: false, harvest_date: '',
    stock_actuel: '1', type_service: 'prestation',
  })
  const [contentType, setContentType] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (!p) { setNotFound(true); return }
      setProfile(p)
    })
  }, [router])

  useEffect(() => {
    if (!editId || !user) return
    const loadAd = async () => {
      setLoadingAd(true)
      try {
        const tables = ['listings', 'products', 'services']
        for (const table of tables) {
          const { data } = await supabase.from(table).select('*').eq('id', editId).maybeSingle()
          if (data) {
            let ct = 'listing'
            if (table === 'products') ct = 'product'
            else if (table === 'services') ct = 'service'
            setContentType(ct)
            setForm({
              title: data.title || data.titre || data.nom || '',
              description: data.description || '',
              price: data.price !== null && data.price !== undefined ? String(data.price) : (data.prix_unitaire !== null && data.prix_unitaire !== undefined ? String(data.prix_unitaire) : (data.tarif_base !== null && data.tarif_base !== undefined ? String(data.tarif_base) : '')),
              unit: data.unit || data.unite_mesure || data.unite || '',
              category_id: String(data.category_id || ''),
              city: data.localite || '',
              region: data.departement || '',
              is_pre_sale: data.is_pre_sale || false,
              harvest_date: data.harvest_date || '',
              stock_actuel: data.stock_actuel !== undefined ? String(data.stock_actuel) : '1',
              type_service: data.type_service || 'prestation',
            })
            if (data.images?.length > 0) setExistingImages(data.images)
            break
          }
        }
      } catch (err) {
        toast.error('Erreur lors du chargement de l\'annonce')
      } finally { setLoadingAd(false) }
    }
    loadAd()
  }, [editId, user])

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
    setImages(prev => [...prev, ...filtered].slice(0, 5))
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
      let uploadedUrls = [...existingImages]
      if (images.length > 0) {
        for (const img of images.slice(0, 5)) {
          const ext = img.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
          const { error: uploadError } = await supabase.storage.from('listing').upload(fileName, img)
          if (uploadError) { toast.error(`Upload échoué : ${uploadError.message}`); setLoading(false); return }
          const { data: { publicUrl } } = supabase.storage.from('listing').getPublicUrl(fileName)
          uploadedUrls.push(publicUrl)
        }
      }
      const method = isEditing ? 'PUT' : 'POST'
      const payload = isEditing
        ? { id: editId, contentType, title: form.title, description: form.description, price: form.price,
            unit: form.unit, category_id: form.category_id, city: form.city, region: form.region,
            image_url: uploadedUrls[0] || '', images: uploadedUrls,
            stock_actuel: form.stock_actuel ? parseInt(form.stock_actuel) : 1,
            type_service: form.type_service }
        : { role, title: form.title, description: form.description, price: form.price,
            unit: form.unit, category_id: form.category_id, city: form.city, region: form.region,
            image_url: uploadedUrls[0] || '', images: uploadedUrls,
            is_pre_sale: form.is_pre_sale, harvest_date: form.harvest_date,
            stock_actuel: form.stock_actuel ? parseInt(form.stock_actuel) : 1,
            type_service: form.type_service }
      const res = await fetch('/api/ads', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la publication')
      const label = isListing ? 'Annonce' : isProduct ? 'Produit' : 'Service'
      toast.success(isEditing ? `${label} modifié${isService ? '' : 'e'} avec succès !` : `${label} publié${isService ? '' : 'e'} avec succès !`)
      router.push('/')
      router.refresh()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication')
    } finally { setLoading(false) }
  }

  const inputClass = "w-full h-12 px-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300"
  const sectionClass = "bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"

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

  const renderForm = () => {
    if (isListing) return (
      <>
        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Photos <span className="text-slate-400 font-normal">({images.length}/5 max)</span>
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
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all duration-200">
                <Upload size={22} />
                <span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre de l&apos;annonce *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80}
            className={inputClass} placeholder="Ex: Recherche tracteur, Vente de poulets de chair..." />
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300 resize-none"
            placeholder="Décrivez votre annonce en détail : quantité, qualité, disponibilité..." />
        </div>

        <div className={sectionClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionnez</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={1}
                  className="w-full h-12 pl-16 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" placeholder="0" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unité <span className="text-slate-400 font-normal">(optionnel)</span></label>
            <input name="unit" value={form.unit} onChange={handleChange} className={inputClass} placeholder="Ex: kg, sac 25kg, tête, caisse..." />
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input type="checkbox" name="is_pre_sale" checked={form.is_pre_sale} onChange={handleChange} id="is_pre_sale" className="sr-only" />
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Calendar size={14} className="inline mr-1" /> Date de récolte estimée</label>
              <input type="date" name="harvest_date" value={form.harvest_date} onChange={handleChange} className={inputClass} />
            </div>
          )}
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *" className={inputClass} />
            <select name="region" value={form.region} onChange={handleChange} required className={inputClass}>
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button disabled={loading}
          className="w-full h-13 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 py-3.5">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {isEditing ? 'Modification...' : 'Publication...'}</span> : <><ShoppingBag size={16} /> {isEditing ? 'Enregistrer les modifications' : 'Publier mon annonce'}</>}
        </button>
      </>
    )

    if (isProduct) return (
      <>
        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Photos <span className="text-slate-400 font-normal">({images.length}/5 max)</span></label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition"><X size={12} /></button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all duration-200">
                <Upload size={22} /><span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du produit *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80} className={inputClass} placeholder="Ex: Foin de qualité, Sac de maïs 25kg..." />
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300 resize-none"
            placeholder="Décrivez votre produit : variété, qualité, origine, mode de production..." />
        </div>

        <div className={sectionClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionnez</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix unitaire *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min={1} step={1}
                  className="w-full h-12 pl-16 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" placeholder="0" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unité de mesure *</label>
              <input name="unit" value={form.unit} onChange={handleChange} required className={inputClass} placeholder="Ex: kg, sac 25kg, ballot..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Box size={14} className="inline mr-1" /> Stock initial</label>
              <div className="relative">
                <input type="number" name="stock_actuel" value={form.stock_actuel} onChange={handleChange} min={0}
                  className={`w-full h-12 px-4 text-sm border-2 rounded-2xl outline-none transition-all duration-200 bg-white focus:ring-4 ${
                    stockZero ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100/60 bg-amber-50/50' : 'border-slate-200 focus:border-agrishop-400 focus:ring-agrishop-100/60 hover:border-slate-300'
                  }`} placeholder="0" />
                {stockZero && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <AlertTriangle size={14} /> Rupture
                  </div>
                )}
              </div>
              {stockZero && <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1"><AlertTriangle size={11} /> Le produit sera marqué comme en rupture de stock</p>}
              {!stockZero && form.stock_actuel !== '' && parseInt(form.stock_actuel) > 0 && <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1"><CheckCircle size={11} /> En stock</p>}
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *" className={inputClass} />
            <select name="region" value={form.region} onChange={handleChange} required className={inputClass}>
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {isEditing ? 'Modification...' : 'Ajout...'}</span> : <><Package size={16} /> {isEditing ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}</>}
        </button>
      </>
    )

    return (
      <>
        <div className={sectionClass}>
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
                  className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    isActive ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
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

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du service *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={80} className={inputClass}
            placeholder={form.type_service === 'recherche' ? 'Ex: Recherche un tractoriste pour labour' : 'Ex: Service de labour mécanisé'} />
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300 resize-none"
            placeholder="Décrivez votre service : compétences, expérience, disponibilités, zone d'intervention..." />
        </div>

        <div className={sectionClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><DollarSign size={14} className="inline mr-1" /> Tarif <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">FCFA</span>
                <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={1}
                  className="w-full h-12 pl-16 pr-4 text-sm border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 placeholder-slate-400 bg-white focus:border-agrishop-400 focus:ring-4 focus:ring-agrishop-100/60 hover:border-slate-300" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unité <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <input name="unit" value={form.unit} onChange={handleChange} className={inputClass} placeholder="Ex: heure, jour, forfait..." />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Localisation *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Commune *" className={inputClass} />
            <select name="region" value={form.region} onChange={handleChange} required className={inputClass}>
              <option value="">Département *</option>
              {regions.flatMap(r => r.departements).filter((d, i, a) => a.indexOf(d) === i).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className={sectionClass}>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Photos <span className="text-slate-400 font-normal">({images.length}/5 max, optionnel)</span></label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 transition"><X size={12} /></button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all duration-200">
                <Upload size={22} /><span className="text-[10px] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <button disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-agrishop-600 to-emerald-600 hover:from-agrishop-700 hover:to-emerald-700 disabled:from-agrishop-400 disabled:to-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-agrishop-200/50 hover:shadow-xl hover:shadow-agrishop-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {isEditing ? 'Modification...' : 'Publication...'}</span> : <><Wrench size={16} /> {isEditing ? 'Enregistrer les modifications' : 'Publier le service'}</>}
        </button>
      </>
    )
  }

  const iconMap = { client: ShoppingBag, vendeur: Package, prestataire: Wrench }
  const titleMap = { client: isEditing ? 'Modifier mon annonce' : 'Déposer une annonce', vendeur: isEditing ? 'Modifier mon produit' : 'Ajouter un produit', prestataire: isEditing ? 'Modifier mon service' : 'Proposer un service' }
  const descMap = { client: isEditing ? 'Modifiez les informations de votre annonce' : 'Publiez une offre ou une demande agricole', vendeur: isEditing ? 'Modifiez les informations de votre produit' : 'Ajoutez un produit à votre catalogue de vente', prestataire: isEditing ? 'Modifiez les informations de votre service' : 'Offrez vos compétences aux agriculteurs' }
  const Icon = iconMap[role]
  const isClientOrVendeur = isListing || isProduct

  return (
    <div className="min-h-screen bg-gradient-to-b from-agrishop-50/40 via-white to-emerald-50/30">
      {/* Hero with Storyset illustration */}
      <div className="relative overflow-hidden bg-gradient-to-br from-agrishop-900 via-emerald-800 to-agrishop-950">
        <img src="/images/hero-ad.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-agrishop-900/80 via-emerald-800/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-14 md:py-20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
              {Icon && <Icon size={28} className="text-emerald-300" />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-heading">{titleMap[role]}</h1>
              <p className="text-white/70 text-sm mt-1">{descMap[role]}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-agrishop-50/40 to-transparent" />
      </div>

      <div className={`max-w-2xl mx-auto px-4 -mt-6 pb-12 relative z-20 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {renderForm()}

          <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1 pt-2">
            <Info size={12} /> En publiant, vous acceptez nos conditions d&apos;utilisation
          </p>
        </form>
      </div>
    </div>
  )
}