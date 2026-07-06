'use client'
import Link from 'next/link'
import { formatPrice } from '@/lib/categories'
import { Eye } from 'lucide-react'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export function OrdersTable({ orders }) {
  if (!orders.length) {
    return <p className="text-slate-400 text-sm py-8 text-center">Aucune commande trouvée.</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="py-3 px-4 font-medium">N° Commande</th>
            <th className="py-3 px-4 font-medium">Acheteur</th>
            <th className="py-3 px-4 font-medium">Total</th>
            <th className="py-3 px-4 font-medium">Statut</th>
            <th className="py-3 px-4 font-medium">Date</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
              <td className="py-3 px-4 font-mono text-xs text-slate-600">#{order.id.toString().slice(0, 8)}</td>
              <td className="py-3 px-4 text-slate-600">{order.profiles?.nom_complet || '—'}</td>
              <td className="py-3 px-4 font-medium text-slate-800">{formatPrice(order.total || order.montant_total)}</td>
              <td className="py-3 px-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[order.status] || 'bg-slate-100 text-slate-600'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
              <td className="py-3 px-4 text-right">
                <Link href={`/admin/commandes/${order.id}`} className="inline-flex p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Voir détails">
                  <Eye size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
