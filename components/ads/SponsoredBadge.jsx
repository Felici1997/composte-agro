export default function SponsoredBadge({ type = 'sponsored' }) {
  const styles = {
    sponsored: 'bg-amber-100 text-amber-700 border-amber-200',
    pro: 'bg-violet-100 text-violet-700 border-violet-200',
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[type] || styles.sponsored}`}>
      {type === 'pro' ? 'PRO' : 'Sponsorisé'}
    </span>
  )
}
