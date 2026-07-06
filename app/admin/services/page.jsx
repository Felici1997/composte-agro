import { getServices } from '@/lib/supabase/admin-queries'
import { ServicesPageClient } from './ServicesPageClient'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminServicesPage({ searchParams }) {
  const sp = await Promise.resolve(searchParams)
  const page = parseInt(sp?.page) || 1
  const { data: services, count } = await getServices({ page })

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Services ({count})</h1>
        <Link href="/admin/services/new" className="inline-flex items-center gap-1.5 bg-composte-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-composte-700 transition">
          <Plus size={16} /> Nouveau service
        </Link>
      </div>
      <ServicesPageClient initialServices={services} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && <a href={`/admin/services?page=${page - 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Précédent</a>}
          <span className="text-sm text-slate-500">Page {page} / {totalPages}</span>
          {page < totalPages && <a href={`/admin/services?page=${page + 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Suivant</a>}
        </div>
      )}
    </div>
  )
}
