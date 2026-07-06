import { getServiceById } from '@/lib/supabase/admin-queries'
import { ServiceForm } from '@/components/admin/ServiceForm'

export default async function EditServicePage({ params }) {
  const { id } = await Promise.resolve(params)
  let service = null
  if (id !== 'new') {
    service = await getServiceById(id)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        {service ? `Modifier : ${service.titre}` : 'Nouveau service'}
      </h1>
      <ServiceForm initialData={service} serviceId={id === 'new' ? null : id} />
    </div>
  )
}
