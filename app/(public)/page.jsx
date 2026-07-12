'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import ClientHome from '@/components/home/ClientHome'
import VendeurHome from '@/components/home/VendeurHome'
import PrestataireHome from '@/components/home/PrestataireHome'
import SearchBanner from '@/components/home/SearchBanner'
import QuickFilters from '@/components/home/QuickFilters'
import TrustBar from '@/components/home/TrustBar'
import PromoCarousel from '@/components/home/PromoCarousel'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturedSellers from '@/components/home/FeaturedSellers'
import RecentAds from '@/components/home/RecentAds'
import FAQSection from '@/components/home/FAQSection'

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
      <QuickFilters />
      <TrustBar />
      <PromoCarousel />
      <HowItWorks />
      <FeaturedSellers />
      <RecentAds />
      <FAQSection />
      <section className="pb-12 text-center">
        <div className="bg-gradient-to-br from-agrishop-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold">Vous avez quelque chose à vendre ?</h2>
          <p className="text-sm text-white/80 mt-2 max-w-md mx-auto">
            Publiez votre annonce gratuitement et touchez des milliers d&apos;acheteurs près de chez vous
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link href="/create-ad" className="inline-flex items-center gap-1.5 bg-white text-agrishop-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-agrishop-50 transition shadow-lg">
              <PlusCircle size={18} /> Publier une annonce
            </Link>
            <Link href="/auth/register" className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl text-sm hover:bg-white/25 transition">
              Créer un compte
            </Link>
          </div>
          <p className="text-xs text-white/50 mt-4">Déjà un compte ? <Link href="/auth/login" className="text-white/80 hover:text-white underline">Connectez-vous</Link></p>
        </div>
      </section>
    </div>
  )
}
