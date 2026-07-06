import { getAdminClient } from '@/lib/supabase/admin'
import { getConversationMessages } from '@/lib/supabase/admin-queries'
import { ConversationView } from '@/components/admin/ConversationView'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ConversationPage({ params }) {
  const { id } = await Promise.resolve(params)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = getAdminClient()
  const { data: conversation } = await admin
    .from('conversations_with_profile')
    .select('*')
    .eq('id', id)
    .single()

  if (!conversation) notFound()

  const messages = await getConversationMessages(id)

  return (
    <div className="max-w-2xl">
      <ConversationView conversation={conversation} messages={messages} currentUserId={user?.id} />
    </div>
  )
}
