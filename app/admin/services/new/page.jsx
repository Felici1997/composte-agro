import { ServiceForm } from '@/components/admin/ServiceForm'

export default function NewServicePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Nouveau service</h1>
      <ServiceForm />
    </div>
  )
}
