import { getOrderById } from '@/lib/supabase/admin-queries'
import { OrderDetail } from '@/components/admin/OrderDetail'
import { notFound } from 'next/navigation'

export default async function OrderDetailPage({ params }) {
  const { id } = await Promise.resolve(params)
  const order = await getOrderById(id)
  if (!order) notFound()

  return <OrderDetail order={order} />
}
