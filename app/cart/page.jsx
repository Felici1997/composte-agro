'use client'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Leaf } from 'lucide-react'
import { formatPrice } from '@/lib/categories'
import { removeItem, incrementQuantity, decrementQuantity, clearCart } from '@/lib/features/cart/cartSlice'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items } = useSelector(state => state.cart)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom_complet: '', telephone: '', lieu_livraison: '' })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase.from('profiles').select('nom_complet, telephone, role').eq('id', session.user.id).single().then(({ data }) => {
          if (data) {
            setForm(prev => ({ ...prev, nom_complet: data.nom_complet || '', telephone: data.telephone || '' }))
            setRole(data.role)
            if (data.role !== 'client') router.replace('/')
          }
        })
      }
    })
  }, [])

  if (role && role !== 'client') return null

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Connectez-vous pour commander')
      router.push('/auth/login')
      return
    }
    if (items.length === 0) {
      toast.error('Panier vide')
      return
    }
    if (!form.nom_complet.trim() || !form.telephone.trim() || !form.lieu_livraison.trim()) {
      toast.error('Remplissez tous les champs')
      return
    }

    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, ...form }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      dispatch(clearCart())
      toast.success('Commande envoyée !')
      router.push('/')
    } else {
      toast.error(data.error || 'Erreur lors de la commande')
    }
  }

  if (!mounted) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><div className="w-12 h-12 bg-slate-100 rounded-full mx-auto animate-pulse" /></div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
        <h1 className="text-xl text-slate-400 font-medium mb-2">Votre panier est vide</h1>
        <Link href="/" className="text-sm text-agrishop-600 hover:underline">Découvrir les annonces</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-4">
        <ArrowLeft size={16} /> Retour
      </button>

      <h1 className="text-xl font-semibold text-slate-700 mb-6">Mon panier</h1>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 shrink-0">
              <Leaf size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
              <p className="text-xs text-slate-400">{formatPrice(item.price ?? 0)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => dispatch(decrementQuantity(item.id))} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-slate-700">{item.quantity}</span>
              <button onClick={() => dispatch(incrementQuantity(item.id))} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <Plus size={14} />
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-700 w-20 text-right">{formatPrice((item.price ?? 0) * item.quantity)}</p>
            <button onClick={() => dispatch(removeItem(item.id))} className="text-slate-300 hover:text-red-500 transition shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-5 space-y-4 mb-6">
        <h2 className="font-semibold text-slate-700 text-sm">Informations de livraison</h2>
        <input name="nom_complet" placeholder="Nom complet *" value={form.nom_complet} onChange={e => setForm(p => ({ ...p, nom_complet: e.target.value }))}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200" />
        <input name="telephone" placeholder="Téléphone *" type="tel" value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200" />
        <input name="lieu_livraison" placeholder="Lieu de livraison *" value={form.lieu_livraison} onChange={e => setForm(p => ({ ...p, lieu_livraison: e.target.value }))}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-agrishop-400 focus:ring-1 focus:ring-agrishop-200" />
      </div>

      <div className="bg-white border rounded-xl p-5 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Total</span>
          <span className="font-bold text-lg text-agrishop-600">{formatPrice(total)}</span>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-agrishop-600 hover:bg-agrishop-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-lg transition text-sm">
          {loading ? 'Envoi en cours...' : `Commander (${formatPrice(total)})`}
        </button>
        {!user && <p className="text-xs text-slate-400 text-center">Connectez-vous pour commander</p>}
      </div>
    </div>
  )
}
