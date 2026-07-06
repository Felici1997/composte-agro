import { getProductById } from '@/lib/supabase/admin-queries'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }) {
  const { id } = await Promise.resolve(params)
  let product = null
  if (id !== 'new') {
    product = await getProductById(id)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        {product ? `Modifier : ${product.nom}` : 'Nouveau produit'}
      </h1>
      <ProductForm initialData={product} productId={id === 'new' ? null : id} />
    </div>
  )
}
