import { Search, Plus, Download, MoreHorizontal } from 'lucide-react'
import StatusBadge from './StatusBadge'
export default function DataTable({ title, subtitle, columns, rows, onAdd, addLabel = 'Add New', onExport, search, setSearch, onRowAction }) {
    return <section className="rounded-2xl border border-white/10 bg-ink-850">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <Search size={14} className="text-slate-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="w-32 bg-transparent text-xs text-white outline-none placeholder:text-slate-600 sm:w-44" />
                </div>
                <button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-gold-500/40 hover:text-gold-300"><Download size={14} /> Export</button><button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 px-3 py-2 text-xs font-bold text-black hover:brightness-110"><Plus size={14} />{addLabel}</button></div></div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
                <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-500">{columns.map(c => <th key={c.key} className="px-5 py-4 font-semibold">{c.label}</th>)}<th className="px-5 py-4">Action</th></tr>
                </thead>
                <tbody>{rows.length ? rows.map((row, i) => <tr key={row.id ?? i} className="border-b border-white/5 text-xs text-slate-300 last:border-0 hover:bg-white/[.025]">{columns.map(c => <td key={c.key} className="px-5 py-4">{c.key === 'status' ? <StatusBadge status={row[c.key]} /> : <span className={c.key === 'id' ? 'font-semibold text-gold-300' : ''}>{row[c.key] ?? '—'}</span>}</td>)}<td className="px-5 py-4"><button onClick={() => onRowAction?.(row)} className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-gold-300"><MoreHorizontal size={16} /></button></td></tr>) : <tr><td colSpan={columns.length + 1} className="px-5 py-12 text-center text-xs text-slate-500">No records found. Add a record to get started.</td></tr>}</tbody></table></div>
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-[11px] text-slate-500"><span>Showing {rows.length} records</span><span>Local demo data · saved in this browser</span></div>
    </section>
}
