'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, XCircle } from 'lucide-react'

export function ConversationView({ conversation, messages, currentUserId }) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          sender_id: currentUserId,
          content: newMessage.trim(),
        }),
      })
      if (!res.ok) throw new Error()
      setNewMessage('')
      router.refresh()
    } catch {
      alert("Erreur lors de l'envoi")
    } finally {
      setSending(false)
    }
  }

  const handleClose = async () => {
    if (!confirm('Fermer cette conversation ?')) return
    const res = await fetch('/api/admin/conversations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: conversation.id, status: 'closed' }),
    })
    if (res.ok) router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition">
          <ArrowLeft size={16} /> Retour
        </button>
        {conversation.status !== 'closed' && (
          <button onClick={handleClose} className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition">
            <XCircle size={16} /> Fermer
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-composte-100 text-composte-700 flex items-center justify-center text-sm font-bold shrink-0">
            {(conversation.nom_complet || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{conversation.nom_complet || 'Anonyme'}</p>
            <p className="text-xs text-slate-400">{conversation.email}{conversation.telephone ? ` · ${conversation.telephone}` : ''}</p>
          </div>
        </div>
        {conversation.sujet && <p className="text-xs text-slate-500 mt-1">Sujet : {conversation.sujet}</p>}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Aucun message dans cette conversation.</p>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`flex ${msg.sender_role === 'assistant' || msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
              msg.sender_role === 'assistant' || msg.sender_id === currentUserId
                ? 'bg-composte-600 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}>
              <p>{msg.content}</p>
              <p className={`text-[10px] mt-0.5 ${msg.sender_role === 'assistant' ? 'text-composte-200' : 'text-slate-400'}`}>
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {conversation.status !== 'closed' && (
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-composte-400"
          />
          <button type="submit" disabled={sending || !newMessage.trim()} className="inline-flex items-center gap-1 bg-composte-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-composte-700 transition disabled:opacity-50">
            <Send size={15} />
            {sending ? '...' : 'Envoyer'}
          </button>
        </form>
      )}
    </div>
  )
}
