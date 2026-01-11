import * as XLSX from 'xlsx'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

export function exportSubmissionsToXlsx(rows) {
  const data = rows.map((row, index) => ({
    No: index + 1,
    Divisi: row.organization,
    Email: row.email,
    Tanggal: formatDate(row.created_at),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Claim Canva Pro')

  const dateLabel = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `claim-canva-${dateLabel}.xlsx`)
}
