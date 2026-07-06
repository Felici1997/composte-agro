import { getOrders } from '@/lib/supabase/admin-queries'
import { OrdersTable } from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage({ searchParams }) {
  const sp = await Promise.resolve(searchParams)
  const page = parseInt(sp?.page) || 1
  const { data: orders, count } = await getOrders({ page })

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Commandes ({count})</h1>
      <OrdersTable orders={orders} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && <a href={`/admin/commandes?page=${page - 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Précédent</a>}
          <span className="text-sm text-slate-500">Page {page} / {totalPages}</span>
          {page < totalPages && <a href={`/admin/commandes?page=${page + 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Suivant</a>}
        </div>
      )}
    </div>
  )
}
