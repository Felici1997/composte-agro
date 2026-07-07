'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ClientHome from '@/components/home/ClientHome'
import VendeurHome from '@/components/home/VendeurHome'
import PrestataireHome from '@/components/home/PrestataireHome'
import SearchBanner from '@/components/home/SearchBanner'
import HeroCategories from '@/components/home/HeroCategories'
import RecentAds from '@/components/home/RecentAds'

export default function Home() {
  const [role, setRole] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()
        setRole(profile?.role || null)
      }
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <div className="max-w-7xl mx-auto px-4 py-6"><div className="animate-pulse space-y-6"><div className="h-48 bg-slate-100 rounded-2xl" /><div className="grid grid-cols-4 gap-4"><div className="h-32 bg-slate-100 rounded-xl" /><div className="h-32 bg-slate-100 rounded-xl" /><div className="h-32 bg-slate-100 rounded-xl" /><div className="h-32 bg-slate-100 rounded-xl" /></div></div></div>
  }

  if (role === 'vendeur') return <VendeurHome />
  if (role === 'prestataire') return <PrestataireHome />
  if (role === 'client') return <ClientHome />

  return (
    <div className="max-w-7xl mx-auto px-4">
      <SearchBanner />
      <HeroCategories />
      <RecentAds />
    </div>
  )
}
