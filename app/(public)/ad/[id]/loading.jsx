export default function AdLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse space-y-6">
      <div className="h-4 bg-slate-200 rounded w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="h-80 bg-slate-200 rounded-xl" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 bg-slate-200 rounded-xl" />
          <div className="h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
