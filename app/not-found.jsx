import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-agrishop-50 via-white to-slate-50">
      <div className="text-center max-w-sm">
        <div className="w-28 h-28 bg-agrishop-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg width="56" height="56" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="95" rx="40" ry="12" fill="#B8D9A6" opacity="0.4" />
            <path d="M60 55 L60 78" stroke="#73BF44" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="60" cy="48" rx="14" ry="10" fill="#73BF44" opacity="0.8" />
            <ellipse cx="60" cy="46" rx="10" ry="7" fill="#8BCF63" />
            <circle cx="88" cy="25" r="10" fill="#FDE68A" opacity="0.9" />
            <circle cx="91" cy="22" r="8" fill="#FCD34D" />
            <line x1="88" y1="14" x2="88" y2="10" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="80" y1="22" x2="76" y2="22" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="96" y1="22" x2="100" y2="22" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <text x="60" y="52" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">?</text>
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-agrishop-700 tracking-tight">404</h1>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Oups&nbsp;! Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-8 bg-agrishop-600 hover:bg-agrishop-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-agrishop-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
