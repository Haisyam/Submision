import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";
import { InputField, SelectField } from "../components/ui/FormField";
import Modal from "../components/ui/Modal";
import FeatureCard from "../components/ui/FeatureCard";
import SectionHeader from "../components/ui/SectionHeader";
import StatCard from "../components/ui/StatCard";
import { organizations } from "../data/organizations";
import { fetchSubmissions, submitEmail } from "../services/submissions";

const features = [
  {
    title: "Validasi cepat",
    description: "Email divisi langsung dicek agar klaim tidak dobel.",
    icon: "01",
  },
  {
    title: "Catatan claim",
    description: "Divisi, email, dan waktu claim tersimpan rapi.",
    icon: "02",
  },
  {
    title: "Akses aman",
    description: "Data claim dilindungi dengan aturan akses yang ketat.",
    icon: "03",
  },
];

const stats = [
  { label: "Divisi kominfo", value: "6+" },
  { label: "Claim sekali", value: "1x" },
  { label: "Notifikasi instan", value: "Seketika" },
];

const initialForm = { organization: "", email: "" };

function Landing() {
  const [isReady, setIsReady] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [showModal, setShowModal] = useState(false);
  const [claimedOrganizations, setClaimedOrganizations] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadClaimed = async () => {
      const { data, error } = await fetchSubmissions();
      if (!isMounted || error) return;
      const claimed = (data || [])
        .map((row) => row.organization?.trim())
        .filter(Boolean);
      setClaimedOrganizations(claimed);
    };
    loadClaimed();
    return () => {
      isMounted = false;
    };
  }, []);

  const availableOrganizations = useMemo(() => {
    const normalize = (value) => value?.trim().toLowerCase();
    const claimedSet = new Set(
      claimedOrganizations.map((org) => normalize(org)).filter(Boolean)
    );
    return organizations.filter(
      (org) => !claimedSet.has(normalize(org))
    );
  }, [claimedOrganizations]);

  useEffect(() => {
    if (
      form.organization &&
      !availableOrganizations.includes(form.organization)
    ) {
      setForm((prev) => ({ ...prev, organization: "" }));
    }
  }, [availableOrganizations, form.organization]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    const selectedOrganization = form.organization;
    const { error } = await submitEmail(form);

    if (error) {
      setStatus({
        loading: false,
        error: error.message || "Gagal mengirim data.",
      });
      return;
    }

    setStatus({ loading: false, error: "" });
    setForm(initialForm);
    if (selectedOrganization) {
      setClaimedOrganizations((prev) => {
        const next = new Set(prev);
        next.add(selectedOrganization);
        return Array.from(next);
      });
    }
    setShowModal(true);
  };

  return (
    <PageShell className={isReady ? "is-ready" : ""}>
      <Navbar />
      <main className="landing">
        <section className="hero reveal">
          <div className="hero__content">
            <span className="hero__eyebrow">Kominfo . Canva Pro Lifetime</span>
            <h1>Claim Canva Pro Lifetime khusus divisi Kominfo.</h1>
            <p>
              Form ini dibuat untuk divisi Kominfo agar claim Canva Pro Lifetime
              tercatat rapi, cepat, dan aman.
            </p>
            <div className="hero__actions">
              <Button
                type="button"
                onClick={() =>
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
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
                  options={availableOrganizations}
                  searchable
                  disabled={!availableOrganizations.length}
                  required
                />
                {!availableOrganizations.length ? (
                  <p className="form-info">Semua divisi sudah claim.</p>
                ) : null}
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email Divisi"
                  description="Gunakan email resmi untuk akses Canva."
                  placeholder="nama@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                {status.error ? (
                  <p className="form-error">{status.error}</p>
                ) : null}
                <Button type="submit" disabled={status.loading}>
                  {status.loading ? "Memproses..." : "Claim"}
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
      </main>

      <footer className="site-footer">
        <span>Kominfo BEM Universitas Majalengka</span>
        <span>Claim Canva Pro Lifetime dengan Gratis.</span>
      </footer>

      <Modal
        open={showModal}
        title="Claim berhasil"
        description="Terima kasih, claim kamu sudah tercatat. Ikuti poin berikut agar undangan tidak terlewat."
        onClose={() => setShowModal(false)}
      >
        <div className="modal__card">
          <h4>Checklist setelah submit</h4>
          <ul className="modal__list">
            <li>Cek Gmail dari email yang kamu submit secara berkala.</li>
            <li>Periksa juga folder Spam, Promosi, atau Sosial.</li>
            <li>Undangan bisa datang bertahap tergantung antrean.</li>
            <li>Jangan submit ulang, tiap divisi hanya 1x claim.</li>
            <li>Jika lama tidak masuk, hubungi Admin Grup Kominfo.</li>
          </ul>
        </div>
        <div className="modal__actions">
          <Button type="button" onClick={() => setShowModal(false)}>
            Oke, siap
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}

export default Landing;
