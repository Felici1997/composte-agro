'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { loadAds } from '@/lib/features/ads/adsSlice'

const OnboardingTour = dynamic(() => import('@/components/onboarding/OnboardingTour'), { ssr: false })

export default function PublicLayout({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadAds())
  }, [dispatch])

  return (
    <>
      <Navbar />
      <OnboardingTour />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
