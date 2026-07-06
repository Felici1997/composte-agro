'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServicesTable } from '@/components/admin/ServicesTable'

export function ServicesPageClient({ initialServices }) {
  const router = useRouter()
  const [services, setServices] = useState(initialServices)

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce service ?')) return
    const res = await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setServices(prev => prev.filter(s => s.id !== id))
      router.refresh()
    }
  }

  return <ServicesTable services={services} onDelete={handleDelete} />
}
