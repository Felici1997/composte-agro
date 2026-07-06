'use client'
import SearchBanner from "@/components/home/SearchBanner"
import HeroCategories from "@/components/home/HeroCategories"
import RecentAds from "@/components/home/RecentAds"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <SearchBanner />
      <HeroCategories />
      <RecentAds />
    </div>
  )
}
