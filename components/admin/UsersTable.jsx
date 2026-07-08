'use client'
import Link from 'next/link'
import { Edit3 } from 'lucide-react'

const roleLabels = {
  admin: { label: 'Admin', class: 'bg-purple-100 text-purple-700' },
  vendeur: { label: 'Vendeur', class: 'bg-blue-100 text-blue-700' },
  acheteur: { label: 'Acheteur', class: 'bg-green-100 text-green-700' },
  prestataire: { label: 'Prestataire', class: 'bg-amber-100 text-amber-700' },
}

export function UsersTable({ users }) {
  if (!users.length) {
    return <p className="text-slate-400 text-sm py-8 text-center">Aucun utilisateur trouvé.</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="py-3 px-4 font-medium">Utilisateur</th>
            <th className="py-3 px-4 font-medium">Email</th>
            <th className="py-3 px-4 font-medium">Téléphone</th>
            <th className="py-3 px-4 font-medium">Rôle</th>
            <th className="py-3 px-4 font-medium">Département</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-agrishop-100 text-agrishop-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {(user.nom_complet || '?').charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium text-slate-800">{user.nom_complet || 'Anonyme'}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-500">{user.email || '—'}</td>
              <td className="py-3 px-4 text-slate-500">{user.telephone || '—'}</td>
              <td className="py-3 px-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(roleLabels[user.role] || roleLabels.acheteur).class}`}>
                  {(roleLabels[user.role] || roleLabels.acheteur).label}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500">{user.departement || '—'}</td>
              <td className="py-3 px-4 text-right">
                <Link href={`/admin/utilisateurs/${user.id}`} className="inline-flex p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Modifier">
                  <Edit3 size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
