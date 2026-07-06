'use client'
import Link from 'next/link'
import { formatPrice } from '@/lib/categories'
import { Edit3, Trash2 } from 'lucide-react'

export function ServicesTable({ services, onDelete }) {
  if (!services.length) {
    return <p className="text-slate-400 text-sm py-8 text-center">Aucun service trouvé.</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="py-3 px-4 font-medium">Service</th>
            <th className="py-3 px-4 font-medium">Prestataire</th>
            <th className="py-3 px-4 font-medium">Type</th>
            <th className="py-3 px-4 font-medium">Tarif</th>
            <th className="py-3 px-4 font-medium">Disponible</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-slate-800 truncate max-w-[200px]">{service.titre}</p>
                  <p className="text-xs text-slate-400">{new Date(service.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-600">{service.profiles?.nom_complet || '—'}</td>
              <td className="py-3 px-4 text-slate-500">
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{service.type_service}</span>
              </td>
              <td className="py-3 px-4 font-medium text-slate-800">{formatPrice(service.tarif_base)}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  service.est_disponible ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {service.est_disponible ? 'Oui' : 'Non'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/services/${service.id}`} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Modifier">
                    <Edit3 size={15} />
                  </Link>
                  <button onClick={() => onDelete(service.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Supprimer">
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
