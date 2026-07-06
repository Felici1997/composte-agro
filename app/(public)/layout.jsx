'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { loadAds } from '@/lib/features/ads/adsSlice'

export default function PublicLayout({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadAds())
  }, [dispatch])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
