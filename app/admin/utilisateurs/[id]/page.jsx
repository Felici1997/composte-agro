import { getUserById } from '@/lib/supabase/admin-queries'
import { UserForm } from '@/components/admin/UserForm'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }) {
  const { id } = await Promise.resolve(params)
  const user = await getUserById(id)
  if (!user) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Modifier : {user.nom_complet || 'Utilisateur'}</h1>
      <UserForm user={user} />
    </div>
  )
}
