import { useState, useEffect } from 'react'
import { getDrivers, createDriver, updateDriver } from "../services/driverService";
import { GradientBanner, PrimaryBtn, Card } from '../components/UI'

const STATUS_STYLES = {
  'Available': { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'On Trip': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },

  'Suspended': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
}

const TOGGLE_STATUSES = ['Available', 'On Trip', 'Suspended']

function isExpired(expiry) {
  const [m, y] = expiry.split('/')
  return new Date(`${y}-${m}-01`) < new Date()
}

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', license: '', category: 'LMV', expiry: '', contact: '', status: 'Available' })



  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  async function toggleStatus(driverIdx, newStatus) {

    const driver = drivers[driverIdx];

    try {

      const response = await updateDriver(
        driver.id,
        {
          status: newStatus
        }
      );
      setDrivers(prev =>
        prev.map((d, i) =>
          i === driverIdx
            ? response.driver
            : d
        )
      );
      setSelectedIdx(null);

    }
    catch (error) {
      console.log(error);
    }
  }

  async function handleAdd() {

    try {

      const payload = {

        name: form.name,
        licenseNumber: form.license,
        licenseCategory: form.category,
        licenseExpiryDate: form.expiry,
        contactNumber: form.contact,
        safetyScore: 100,
        status: form.status

      };

      const response = await createDriver(payload);
      setDrivers(prev => [
        ...prev,
        response.driver
      ]);

      setShowModal(false);

      setForm({
        name: '',
        license: '',
        category: 'LMV',
        expiry: '',
        contact: '',
        status: 'Available'
      });


    }
    catch (error) {

      console.log(error);

    }

  }

  return (
    <section className="space-y-5">
      <GradientBanner title="Drivers & Safety Profiles" subtitle="Track driver records, licenses, and compliance">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          + Add Driver
        </button>
      </GradientBanner>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading drivers...</p>
        ) : (
          drivers.length === 0 ? (
            <p className="text-center text-muted-foreground">No drivers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Driver', 'License No', 'Category', 'Expiry', 'Contact', 'Trip Compl.', 'Safety', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d, i) => {
                    const expiry = new Date(d.license_expiry);
                    const expired = expiry < new Date();
                    const ss = STATUS_STYLES[d.status] || STATUS_STYLES['Available'];

                    const safeStatus = Number(d.safety_score) >= 80
                      ? "Available"
                      : "Suspended";

                    const safeSt = STATUS_STYLES[safeStatus] || STATUS_STYLES['Available'];
                    return (
                      <tr key={d.id}
                        onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                        className={`border-b border-border/50 cursor-pointer transition-colors ${selectedIdx === i ? 'bg-secondary/30' : 'hover:bg-secondary/10'}`}
                      >
                        <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: 'linear-gradient(135deg,#714b67,#432c3d)' }}>{d.name[0]}</div>
                          {d.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#714b67' }}>{d.license_number}</td>
                        <td className="px-4 py-3 text-foreground">{d.license_category}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${expired ? 'text-red-600 font-bold' : 'text-foreground'}`}>
                            {new Date(d.license_expiry).toLocaleDateString()}{expired && ' EXPIRED'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{d.contact_number}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `0%`, background: '#714b67' }} />
                            </div>
                            <span className="text-xs text-muted-foreground">0%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold border"
                            style={{ background: safeSt.bg, color: safeSt.color, borderColor: safeSt.border }}>{d.safety_score}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold border"
                            style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>{d.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}


        {/* Toggle strip */}
        {selectedIdx !== null && (
          <div className="px-5 py-4 border-t border-border bg-secondary/10">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Toggle status for <strong>{drivers[selectedIdx].name}</strong>:
            </p>
            <div className="flex flex-wrap gap-2">
              {TOGGLE_STATUSES.map(s => {
                const st = STATUS_STYLES[s]
                const active = drivers[selectedIdx].status === s
                return (
                  <button key={s} onClick={() => toggleStatus(selectedIdx, s)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      background: active ? st.color : st.bg,
                      color: active ? '#fff' : st.color,
                      borderColor: st.border,
                    }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {selectedIdx === null && (
          <div className="px-5 py-3 border-t border-border bg-secondary/10">
            <p className="text-xs text-muted-foreground">👆 Click a row to toggle driver status.</p>
          </div>
        )}

        <div className="px-5 py-3 border-t border-border" style={{ background: '#fff8f0' }}>
          <p className="text-xs font-medium" style={{ color: '#c2410c' }}>
            ⚠ Rule: Expired license or Suspended status → blocked from Trip assignment.
          </p>
        </div>
      </Card>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Add New Driver</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              {[['Full Name', 'name', 'text', 'Alex Kumar'], ['License No', 'license', 'text', 'DL-XXXXX'], ['Contact', 'contact', 'text', '98765xxxxx'], ['License Expiry', 'expiry', 'date', 'YYYY-MM-DD']].map(([lbl, key, type, ph]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">{lbl}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="block w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="block w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground appearance-none cursor-pointer focus:outline-none">
                  {['LMV', 'HMV', 'PSV'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <PrimaryBtn full onClick={handleAdd}>Add Driver</PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
