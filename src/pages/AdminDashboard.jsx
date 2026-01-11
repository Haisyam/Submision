import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import PageShell from '../components/layout/PageShell'
import Button from '../components/ui/Button'
import AdminTable from '../components/ui/AdminTable'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { deleteSubmission, fetchSubmissions } from '../services/submissions'
import { exportSubmissionsToXlsx } from '../utils/exportXlsx'

const initialLogin = { email: '', password: '' }

function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false)
      return
    }

    let isMounted = true

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return
        if (error) setAuthError(error.message)
        setSession(data.session)
        setAuthLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setAuthError(err?.message || 'Gagal memeriksa sesi.')
        setAuthLoading(false)
      })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return
        setSession(nextSession)
      },
    )

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error } = await fetchSubmissions()
    if (error) {
      setError(error.message || 'Gagal memuat data.')
      setRows([])
    } else {
      setRows(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) {
      loadData()
    }
  }, [loadData, session])

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) => {
      const organization = row.organization?.toLowerCase() || ''
      const email = row.email?.toLowerCase() || ''
      return organization.includes(term) || email.includes(term)
    })
  }, [rows, query])

  const stats = useMemo(() => {
    const orgSet = new Set(rows.map((row) => row.organization).filter(Boolean))
    return { total: rows.length, organizations: orgSet.size }
  }, [rows])

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthError('')
    if (!supabase) return

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })

    if (error) setAuthError(error.message)
  }

  const handleLogout = async () => {
    if (!supabase) return
    setLogoutLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError(error.message)
    } else {
      setSession(null)
      setRows([])
      setQuery('')
    }
    setLogoutLoading(false)
  }

  const handleDelete = async (row) => {
    if (!row?.id) return
    const ok = window.confirm(
      `Hapus email ${row.email} dari divisi ${row.organization}?`,
    )
    if (!ok) return

    setDeletingId(row.id)
    setError('')
    const { error } = await deleteSubmission(row.id)
    if (error) {
      setError(error.message || 'Gagal menghapus data.')
    } else {
      setRows((prev) => prev.filter((item) => item.id !== row.id))
    }
    setDeletingId(null)
  }

  if (!isSupabaseConfigured) {
    return (
      <PageShell className="admin-page is-ready">
        <Navbar variant="admin" />
        <main className="admin">
          <section className="admin__empty reveal">
            <h2>Konfigurasi belum lengkap</h2>
            <p>Lengkapi env agar dashboard bisa membaca data.</p>
            <code className="code-block">
              VITE_SUPABASE_URL=...{'\n'}
              VITE_SUPABASE_ANON_KEY=...{'\n'}
              VITE_SUPABASE_TABLE=email_submissions
            </code>
          </section>
        </main>
      </PageShell>
    )
  }

  const showAdminChrome = Boolean(session)

  return (
    <PageShell className="admin-page is-ready">
      {showAdminChrome ? <Navbar variant="admin" /> : null}
      <main className="admin">
        {showAdminChrome ? (
          <section className="admin__header reveal">
            <div>
              <h1>Dashboard Claim Canva Pro</h1>
              <p>Kelola dan ekspor data claim divisi Kominfo secara aman.</p>
            </div>
            <div className="admin__actions">
              <Button variant="ghost" onClick={loadData} type="button">
                {loading ? 'Memuat...' : 'Refresh'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => exportSubmissionsToXlsx(filteredRows)}
                type="button"
                disabled={!filteredRows.length}
              >
                Export .xlsx
              </Button>
              <Button onClick={handleLogout} type="button" disabled={logoutLoading}>
                {logoutLoading ? 'Logout...' : 'Logout'}
              </Button>
            </div>
          </section>
        ) : null}

        {authLoading ? (
          <section className="admin__empty reveal">
            <p>Memeriksa sesi admin...</p>
          </section>
        ) : session ? (
          <>
            <section className="admin__stats reveal">
              <div className="stat-card">
                <span className="stat-card__value">{stats.total}</span>
                <span className="stat-card__label">Total email</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__value">{stats.organizations}</span>
                <span className="stat-card__label">Divisi</span>
              </div>
              <label className="search">
                <span>Cari</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari divisi atau email"
                  aria-label="Cari divisi atau email"
                />
              </label>
            </section>
            {error ? <p className="form-error">{error}</p> : null}
            {filteredRows.length ? (
              <AdminTable
                rows={filteredRows}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ) : (
              <section className="admin__empty">
                <p>Belum ada data yang cocok.</p>
              </section>
            )}
          </>
        ) : (
          <section className="admin__login reveal">
            <div className="admin__login-grid">
              <div className="admin__login-copy">
                <span className="pill">Akses Admin</span>
                <h2>Masuk untuk kelola claim Canva Pro.</h2>
                <p>
                  Dashboard ini khusus admin Kominfo untuk memantau claim divisi,
                  menyaring, dan mengekspor data kapan saja.
                </p>
                <ul className="admin__login-points">
                  <li>Filter divisi dan email secara instan.</li>
                  <li>Ekspor .xlsx sekali klik tanpa aplikasi tambahan.</li>
                  <li>Data claim tersusun rapi dengan timestamp otomatis.</li>
                </ul>
              </div>
              <div className="glow-card">
                <h2>Login Admin</h2>
                <p className="glow-card__subtitle">
                  Masuk menggunakan akun admin yang telah didaftarkan.
                </p>
                <form className="form-card" onSubmit={handleLogin}>
                  <label className="field" htmlFor="admin-email">
                    <span className="field__label">Email admin</span>
                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      className="field__input"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="field" htmlFor="admin-password">
                    <span className="field__label">Password</span>
                    <input
                      id="admin-password"
                      name="password"
                      type="password"
                      className="field__input"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      autoComplete="current-password"
                      required
                    />
                  </label>
                  {authError ? <p className="form-error">{authError}</p> : null}
                  <Button type="submit">Masuk</Button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </PageShell>
  )
}

export default AdminDashboard
