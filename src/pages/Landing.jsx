import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import PageShell from '../components/layout/PageShell'
import Button from '../components/ui/Button'
import { InputField, SelectField } from '../components/ui/FormField'
import Modal from '../components/ui/Modal'
import FeatureCard from '../components/ui/FeatureCard'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import { organizations } from '../data/organizations'
import { submitEmail } from '../services/submissions'

const features = [
  {
    title: 'Validasi cepat',
    description: 'Email divisi langsung dicek agar klaim tidak dobel.',
    icon: '01',
  },
  {
    title: 'Catatan claim',
    description: 'Divisi, email, dan waktu claim tersimpan rapi.',
    icon: '02',
  },
  {
    title: 'Akses aman',
    description: 'Data claim dilindungi dengan aturan akses yang ketat.',
    icon: '03',
  },
]

const stats = [
  { label: 'Divisi kominfo', value: '6+' },
  { label: 'Claim sekali', value: '1x' },
  { label: 'Notifikasi instan', value: 'Seketika' },
]

const initialForm = { organization: '', email: '' }

function Landing() {
  const [isReady, setIsReady] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ loading: false, error: '' })
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    const { error } = await submitEmail(form)

    if (error) {
      setStatus({ loading: false, error: error.message || 'Gagal mengirim data.' })
      return
    }

    setStatus({ loading: false, error: '' })
    setForm(initialForm)
    setShowModal(true)
  }

  return (
    <PageShell className={isReady ? 'is-ready' : ''}>
      <Navbar />
      <main className="landing">
        <section className="hero reveal">
          <div className="hero__content">
            <span className="hero__eyebrow">Kominfo . Canva Pro Lifetime</span>
            <h1>Claim Canva Pro Lifetime khusus divisi Kominfo.</h1>
            <p>
              Form ini dibuat untuk divisi Kominfo agar claim
              Canva Pro Lifetime tercatat rapi, cepat, dan aman.
            </p>
            <div className="hero__actions">
              <Button
                type="button"
                onClick={() =>
                  formRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
              >
                Mulai claim
              </Button>
              <span className="hero__note">Data claim tercatat otomatis.</span>
            </div>
          </div>
          <div className="hero__panel">
            <div className="glow-card">
              <h2>Form Claim Canva Pro</h2>
              <p className="glow-card__subtitle">
                Isi divisi Kominfo dan email untuk proses claim.
              </p>
              <form className="form-card" onSubmit={handleSubmit} ref={formRef}>
                <SelectField
                  id="organization"
                  name="organization"
                  label="Divisi Kominfo"
                  description="Pilih divisi Kominfo yang kamu wakili."
                  value={form.organization}
                  onChange={handleChange}
                  options={organizations}
                  required
                />
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email Divisi"
                  description="Gunakan email resmi untuk akses Canva."
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                {status.error ? <p className="form-error">{status.error}</p> : null}
                <Button type="submit" disabled={status.loading}>
                  {status.loading ? 'Memproses...' : 'Claim'}
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="stats reveal">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <section className="features reveal">
          <SectionHeader
            eyebrow="Kenapa claim ini"
            title="Satu divisi, satu claim, satu data"
            subtitle="Setiap claim tercatat otomatis agar tidak terjadi duplikasi."
            align="center"
          />
          <div className="features__grid">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="security-note reveal">
          <SectionHeader
            eyebrow="Keamanan"
            title="Akses data disaring dan diaudit"
            subtitle="Data claim dilindungi dengan autentikasi dan aturan akses yang ketat."
            align="left"
          />
          <div className="security-note__panel">
            <div>
              <h3>Perlindungan utama</h3>
              <ul>
                <li>Email diverifikasi agar claim tidak dobel.</li>
                <li>Akses data dibatasi sesuai aturan keamanan.</li>
                <li>Export .xlsx langsung dari data claim yang valid.</li>
              </ul>
            </div>
            <div className="security-note__highlight">
              <span className="pill">Rekomendasi</span>
              <p>
                Aktifkan aturan akses agar data claim hanya bisa diakses sesuai izin.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>Kominfo Canva Claim</span>
        <span>Claim Canva Pro Lifetime dengan data rapi.</span>
      </footer>

      <Modal
        open={showModal}
        title="Claim berhasil"
        description="Email divisi kamu sudah masuk ke dashboard admin."
        onClose={() => setShowModal(false)}
      >
        <div className="modal__actions">
          <Button type="button" onClick={() => setShowModal(false)}>
            Oke, siap
          </Button>
        </div>
      </Modal>
    </PageShell>
  )
}

export default Landing
