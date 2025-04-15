export function Logo() {
  return (
    <>
      <div className="relative h-20 w-36 scale-75 rounded-b-2xl border-slate-50 bg-slate-300 shadow-sm md:scale-100" />

      <div className="absolute inset-0 top-1 flex scale-75 flex-col text-center md:scale-100">
        <span className="text-3xl font-bold text-slate-950">AMH</span>
        <span className="text-xs font-semibold text-muted">AI Mentor Hub</span>
      </div>
    </>
  )
}
