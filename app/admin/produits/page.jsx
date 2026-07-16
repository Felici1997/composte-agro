import { getProducts } from '@/lib/supabase/admin-queries'
import { ProductsPageClient } from './ProductsPageClient'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminProductsPage({ searchParams }) {
  const sp = await Promise.resolve(searchParams)
  const page = parseInt(sp?.page) || 1
  const { data: products, count } = await getProducts({ page })

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Producteurs ({count})</h1>
        <Link href="/admin/produits/new" className="inline-flex items-center gap-1.5 bg-agrishop-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-agrishop-700 transition">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>
      <ProductsPageClient initialProducts={products} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && <a href={`/admin/produits?page=${page - 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Précédent</a>}
          <span className="text-sm text-slate-500">Page {page} / {totalPages}</span>
          {page < totalPages && <a href={`/admin/produits?page=${page + 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Suivant</a>}
        </div>
      )}
    </div>
  )
}
