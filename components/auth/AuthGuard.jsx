'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, fetchWithTimeout } from '@/lib/supabase/client'

export default function AuthGuard({ children }) {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const checkAuth = async () => {
      try {
        const { data: { session } } = await fetchWithTimeout(supabase.auth.getSession(), 8000)
        if (cancelled) return
        if (!session) {
          router.push('/auth/login')
        }
      } catch {
        if (!cancelled) router.push('/auth/login')
      }
    }
    checkAuth()
    return () => { cancelled = true }
  }, [router])

  return <>{children}</>
}
