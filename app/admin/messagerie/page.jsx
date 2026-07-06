import { getConversations } from '@/lib/supabase/admin-queries'
import { ConversationsList } from '@/components/admin/ConversationsList'

export default async function AdminMessageriePage({ searchParams }) {
  const sp = await Promise.resolve(searchParams)
  const page = parseInt(sp?.page) || 1
  const { data: conversations, count } = await getConversations({ page })

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Messagerie ({count})</h1>
      <ConversationsList conversations={conversations} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && <a href={`/admin/messagerie?page=${page - 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Précédent</a>}
          <span className="text-sm text-slate-500">Page {page} / {totalPages}</span>
          {page < totalPages && <a href={`/admin/messagerie?page=${page + 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Suivant</a>}
        </div>
      )}
    </div>
  )
}
