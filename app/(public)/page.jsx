'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, ArrowRight, Leaf } from 'lucide-react'
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
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-[520px] bg-slate-100 rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
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

      {/* CTA Section */}
      <section className="pb-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-agrishop-800 via-agrishop-700 to-earth-800 rounded-3xl p-10 md:p-14 text-white shadow-xl min-h-[360px] flex items-center justify-center">
          <div className="absolute inset-0">
            <img src="/images/cta-bg.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-agrishop-950/90 via-agrishop-900/80 to-earth-950/80" />
            <div className="absolute top-0 left-0 w-80 h-80 bg-agrishop-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 text-center max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-white/10">
              <Leaf size={14} className="text-emerald-300" />
              Rejoignez la communauté
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Vous avez quelque chose à vendre ?</h2>
            <p className="text-sm sm:text-base text-white/80 mb-7 max-w-md mx-auto">
              Publiez votre annonce gratuitement et touchez des milliers d&apos;acheteurs près de chez vous
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/create-ad" className="inline-flex items-center gap-2 bg-white text-agrishop-800 font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-agrishop-50 transition shadow-lg shadow-black/10 group">
                <PlusCircle size={18} /> Publier une annonce <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 text-white font-medium px-7 py-3.5 rounded-xl text-sm transition">
                Créer un compte
              </Link>
            </div>
            <p className="text-xs text-white/50 mt-5">Déjà un compte ? <Link href="/auth/login" className="text-white/80 hover:text-white underline font-medium">Connectez-vous</Link></p>
          </div>
        </div>
      </section>
    </div>
  )
}