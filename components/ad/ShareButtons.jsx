'use client'
import { Share2, Link, Check, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ShareButtons({ title, id }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/ad/${id}` : ''
  const text = `Regarde cette annonce sur Composte : ${title}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Lien copié !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-1 text-xs text-slate-400 mr-0.5">
        <Share2 size={13} /> Partager
      </span>
      <button onClick={shareWhatsApp} className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 transition-all hover:scale-105" title="Partager sur WhatsApp">
        <MessageCircle size={16} />
      </button>
      <button onClick={shareFacebook} className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 transition-all hover:scale-105" title="Partager sur Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>
      <button onClick={copyLink} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 ${copied ? 'bg-agrishop-50 text-agrishop-700 border-agrishop-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'}`} title="Copier le lien">
        {copied ? <Check size={15} /> : <Link size={15} />}
      </button>
    </div>
  )
}