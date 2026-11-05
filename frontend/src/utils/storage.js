import { seedData } from '../data/seed'
const KEY = 'franchise-crm-data-v1'
export function loadData() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : seedData
  } catch { return seedData }
}
export function saveData(data) { localStorage.setItem(KEY, JSON.stringify(data)) }
export function exportCsv(rows, filename = 'export.csv') {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(row => headers.map(key => `"${String(row[key] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
