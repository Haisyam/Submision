function AdminTable({ rows, onDelete, deletingId }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Divisi</th>
            <th>Email</th>
            <th>Tanggal</th>
            {onDelete ? <th>Aksi</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || `${row.email}-${index}`}>
              <td>{index + 1}</td>
              <td>{row.organization}</td>
              <td>{row.email}</td>
              <td>{row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '-'}</td>
              {onDelete ? (
                <td>
                  <button
                    type="button"
                    className="table-action table-action--danger"
                    onClick={() => onDelete(row)}
                    disabled={deletingId === row.id}
                  >
                    {deletingId === row.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
