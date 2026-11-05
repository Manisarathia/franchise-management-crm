import { X } from 'lucide-react'
export default function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-850 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X size={18} /></button></div>
      <div className="p-6">{children}</div></div></div>
}
