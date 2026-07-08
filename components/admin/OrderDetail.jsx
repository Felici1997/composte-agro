'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/categories'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export function OrderDetail({ order }) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [updating, setUpdating] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setCurrentStatus(newStatus)
      setShowStatusMenu(false)
      router.refresh()
    } catch {
      alert('Erreur lors du changement de statut')
    } finally {
      setUpdating(false)
    }
  }

  const canCancel = !['delivered', 'cancelled'].includes(currentStatus)

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Commande #{order.id.toString().slice(0, 8)}</h2>
            <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowStatusMenu(!showStatusMenu)} disabled={updating} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition">
              {statusLabels[currentStatus] || currentStatus}
              <ChevronDown size={14} />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                {statusFlow.map(s => (
                  <button key={s} onClick={() => handleStatusChange(s)} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 transition ${currentStatus === s ? 'text-agrishop-600 font-medium' : 'text-slate-600'}`}>
                    {statusLabels[s]}
                  </button>
                ))}
                {canCancel && (
                  <button onClick={() => handleStatusChange('cancelled')} className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition">
                    Annuler
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Acheteur</h3>
            <p className="text-sm font-medium text-slate-800">{order.profiles?.nom_complet || '—'}</p>
            <p className="text-sm text-slate-500">{order.profiles?.email}</p>
            {order.profiles?.telephone && <p className="text-sm text-slate-500">{order.profiles.telephone}</p>}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vendeur</h3>
            <p className="text-sm font-medium text-slate-800">{order.vendeur?.nom_complet || '—'}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Articles</h3>
          <div className="space-y-2">
            {(order.order_items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden shrink-0">
                  {item.product?.image_url ? (
                    <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">N/A</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.product?.nom || item.service?.titre || 'Article'}</p>
                  <p className="text-xs text-slate-400">Qté: {item.quantite || 1}</p>
                </div>
                <p className="font-medium text-slate-800">{formatPrice(item.prix_unitaire || item.prix || 0)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Total</p>
          <p className="text-lg font-bold text-slate-800">{formatPrice(order.total || order.montant_total || 0)}</p>
        </div>
      </div>
    </div>
  )
}
