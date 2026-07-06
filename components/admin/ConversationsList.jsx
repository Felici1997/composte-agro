'use client'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-500',
  pending: 'bg-amber-100 text-amber-700',
}

export function ConversationsList({ conversations }) {
  if (!conversations.length) {
    return (
      <div className="text-center py-12">
        <MessageCircle size={40} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm text-slate-400">Aucune conversation.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map(conv => (
        <Link
          key={conv.id}
          href={`/admin/conversations/${conv.id}`}
          className="block bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-composte-100 text-composte-700 flex items-center justify-center text-xs font-bold shrink-0">
                {(conv.nom_complet || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{conv.nom_complet || 'Anonyme'}</p>
                {conv.email && <p className="text-xs text-slate-400">{conv.email}</p>}
              </div>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[conv.status] || 'bg-slate-100 text-slate-500'}`}>
              {conv.status || 'active'}
            </span>
          </div>
          <p className="text-sm text-slate-600 truncate mt-1">{conv.last_message || 'Aucun message'}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : ''}
          </p>
        </Link>
      ))}
    </div>
  )
}
