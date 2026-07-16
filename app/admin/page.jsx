import { getAdminStats } from '@/lib/supabase/admin-queries'
import { Package, Wrench, Users, ShoppingCart, MessageSquare } from 'lucide-react'

const cards = [
  { key: 'productsCount', label: 'Producteurs', icon: Package, color: 'text-blue-600 bg-blue-100', link: '/admin/produits' },
  { key: 'servicesCount', label: 'Services', icon: Wrench, color: 'text-amber-600 bg-amber-100', link: '/admin/services' },
  { key: 'usersCount', label: 'Utilisateurs', icon: Users, color: 'text-green-600 bg-green-100', link: '/admin/utilisateurs' },
  { key: 'ordersCount', label: 'Commandes', icon: ShoppingCart, color: 'text-purple-600 bg-purple-100', link: '/admin/commandes' },
  { key: 'feedbackCount', label: 'Feedback', icon: MessageSquare, color: 'text-rose-600 bg-rose-100', link: '/admin/feedback' },
]

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ key, label, icon: Icon, color }) => (
          <a key={key} href={cards.find(c => c.key === key).link} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats[key]}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
