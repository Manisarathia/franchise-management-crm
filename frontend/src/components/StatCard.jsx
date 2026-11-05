import { ArrowUpRight } from 'lucide-react'
export default function StatCard({ label, value, change, icon: Icon, tone='gold' }) {
 const tones = { gold:'bg-gold-500/10 text-gold-400', green:'bg-emerald-500/10 text-emerald-400', purple:'bg-violet-500/10 text-violet-400', blue:'bg-sky-500/10 text-sky-400' }
 return <div className="rounded-2xl border border-white/10 bg-ink-850 p-5 transition hover:-translate-y-1 hover:border-gold-500/30"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">{label}</span><div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={19}/></div></div><div className="mt-4 flex items-end justify-between"><p className="text-2xl font-bold tracking-tight text-white">{value}</p><span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400"><ArrowUpRight size={13}/>{change}</span></div></div>
}
