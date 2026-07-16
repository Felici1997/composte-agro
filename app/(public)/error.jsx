'use client'
import { useEffect } from 'react'

export default function PublicError({ error, reset }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h1 className="text-xl font-semibold text-slate-700">Une erreur est survenue</h1>
      <p className="text-sm text-slate-400 mt-1">Nous ne pouvons pas afficher cette page pour le moment.</p>
      <button onClick={reset} className="mt-6 text-sm bg-agrishop-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-agrishop-700 transition">
        Réessayer
      </button>
    </div>
  )
}
