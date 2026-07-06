'use client'
import { Search, Bell, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'

export function AdminHeader() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4 shrink-0">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit, utilisateur..."
          className="w-full bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" aria-label="Déconnexion">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
