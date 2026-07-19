'use client'
import Link from 'next/link'
import { formatPrice } from '@/lib/categories'
import { Edit3, Trash2, Eye, EyeOff } from 'lucide-react'

export function ProductsTable({ products, onToggleActive, onDelete }) {
  if (!products.length) {
    return <p className="text-slate-400 text-sm py-8 text-center">Aucun produit trouvé.</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="py-3 px-4 font-medium">Produit</th>
            <th className="py-3 px-4 font-medium">Vendeur</th>
            <th className="py-3 px-4 font-medium">Prix</th>
            <th className="py-3 px-4 font-medium">Vues</th>
            <th className="py-3 px-4 font-medium">Département</th>
            <th className="py-3 px-4 font-medium">Statut</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {(product.images?.[0] || product.image_url) ? (
                      <img src={product.images?.[0] || product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">N/A</div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 truncate max-w-[200px]">{product.nom}</p>
                    <p className="text-xs text-slate-400">{new Date(product.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-600">{product.profiles?.nom_complet || '—'}</td>
              <td className="py-3 px-4 font-medium text-slate-800">{formatPrice(product.prix_unitaire || product.tarif)}</td>
              <td className="py-3 px-4 text-slate-500">{product.views ?? 0}</td>
              <td className="py-3 px-4 text-slate-500">{product.departement || '—'}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  product.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {product.is_active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onToggleActive(product.id, !product.is_active)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title={product.is_active ? 'Désactiver' : 'Activer'}>
                    {product.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <Link href={`/admin/produits/${product.id}`} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Modifier">
                    <Edit3 size={15} />
                  </Link>
                  <button onClick={() => onDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Supprimer">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
