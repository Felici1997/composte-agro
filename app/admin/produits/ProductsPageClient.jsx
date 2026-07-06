'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductsTable } from '@/components/admin/ProductsTable'

export function ProductsPageClient({ initialProducts }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)

  const handleToggleActive = async (id, isActive) => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: isActive }),
    })
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: isActive } : p))
      router.refresh()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      router.refresh()
    }
  }

  return (
    <ProductsTable products={products} onToggleActive={handleToggleActive} onDelete={handleDelete} />
  )
}
