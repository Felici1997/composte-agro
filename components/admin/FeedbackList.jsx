'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, CheckCircle } from 'lucide-react'

const typeLabels = {
  bug: { label: 'Bug', class: 'bg-red-100 text-red-700' },
  suggestion: { label: 'Suggestion', class: 'bg-blue-100 text-blue-700' },
  question: { label: 'Question', class: 'bg-amber-100 text-amber-700' },
  autre: { label: 'Autre', class: 'bg-slate-100 text-slate-600' },
}

export function FeedbackList({ feedbacks }) {
  const router = useRouter()
  const [list, setList] = useState(feedbacks)

  const handleMarkTreated = async (id) => {
    const res = await fetch('/api/admin/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'traite' }),
    })
    if (res.ok) {
      setList(prev => prev.map(f => f.id === id ? { ...f, status: 'traite' } : f))
      router.refresh()
    }
  }

  if (!list.length) {
    return (
      <div className="text-center py-12">
        <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm text-slate-400">Aucun feedback.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {list.map(feedback => (
        <div key={feedback.id} className={`bg-white rounded-xl border p-4 transition ${
          feedback.status === 'traite' ? 'border-green-200 opacity-60' : 'border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(typeLabels[feedback.type] || typeLabels.autre).class}`}>
                {(typeLabels[feedback.type] || typeLabels.autre).label}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                feedback.status === 'traite' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {feedback.status === 'traite' ? 'Traité' : 'Non traité'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{new Date(feedback.created_at).toLocaleDateString('fr-FR', { dateStyle: 'short' })}</p>
          </div>
          <p className="text-sm text-slate-700 mb-2">{feedback.message}</p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{feedback.profiles?.nom_complet || 'Anonyme'} · {feedback.profiles?.email || ''}</span>
            {feedback.status !== 'traite' && (
              <button onClick={() => handleMarkTreated(feedback.id)} className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition">
                <CheckCircle size={14} /> Marquer traité
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
