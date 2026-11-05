export default function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase()
  const color = s.includes('active') || s.includes('valid') || s.includes('signed') ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20'
    : s.includes('expir') || s.includes('review') || s.includes('pending') || s.includes('upcoming') ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
    : s.includes('expired') || s.includes('overdue') || s.includes('inactive') || s.includes('reject') ? 'bg-rose-400/10 text-rose-300 border-rose-400/20'
    : 'bg-sky-400/10 text-sky-300 border-sky-400/20'
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${color}`}>{status}</span>
}
