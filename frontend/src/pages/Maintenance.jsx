import { useState } from 'react'
import { GradientBanner, PrimaryBtn, Card } from '../components/UI'

const STATUS_STYLES = {
  'In Shop': { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
  'Completed': { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'Scheduled': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
}

const INITIAL_LOGS = [
  { vehicle: 'VAN-05', service: 'Oil Change', cost: '2,500', date: '01/07/2026', status: 'In Shop' },
  { vehicle: 'TRUCK-11', service: 'Engine Repair', cost: '18,000', date: '05/07/2026', status: 'Completed' },
  { vehicle: 'MINI-09', service: 'Tyre Replace', cost: '6,200', date: '06/07/2026', status: 'In Shop' },
]

const VEHICLE_OPTIONS = ['VAN-05', 'TRUCK-11', 'MINI-09', 'VAN-09']
const SERVICE_TYPES = ['Oil Change', 'Tyre Rotation', 'Engine Repair', 'Brake Service', 'AC Repair', 'Tyre Replace', 'Other']

export default function Maintenance() {
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [form, setForm] = useState({ vehicle: '', service: 'Oil Change', cost: '', date: '', status: 'In Shop' })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!form.vehicle || !form.cost || !form.date) return
    setLogs(prev => [{ ...form }, ...prev])
    setForm({ vehicle: '', service: 'Oil Change', cost: '', date: '', status: 'In Shop' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggleStatus(idx) {
    setLogs(prev => prev.map((l, i) => i === idx
      ? { ...l, status: l.status === 'In Shop' ? 'Completed' : 'In Shop' }
      : l
    ))
  }

  const inputCls = "block w-full px-3 py-2.5 border border-border rounded-lg text-sm text-foreground bg-white placeholder:text-muted-foreground focus:outline-none hover:border-primary/40 transition-colors"
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"

  return (
    <section className="space-y-5">
      <GradientBanner title="Maintenance & Service Logs" subtitle="Track all vehicle service records and schedules" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Log Form */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-foreground mb-5">Log Service Record</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Vehicle</label>
              <select value={form.vehicle} onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select vehicle...</option>
                {VEHICLE_OPTIONS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Service Type</label>
              <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className={inputCls + " appearance-none cursor-pointer"}>
                {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Cost (₹)</label>
              <input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="e.g. 2500" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls + " appearance-none cursor-pointer"}>
                <option>In Shop</option>
                <option>Completed</option>
                <option>Scheduled</option>
              </select>
            </div>
            {saved && <div className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">✓ Service log saved successfully!</div>}
            <PrimaryBtn full onClick={handleSave}>Save</PrimaryBtn>
          </div>

          {/* Status Flow */}
          <div className="mt-6 pt-5 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full font-bold text-green-700 bg-green-100">Available</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <svg className="w-8 h-2" viewBox="0 0 40 8"><path d="M0 4 H32 M30 1 L36 4 L30 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                Log service
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold text-orange-700 bg-orange-100">In Shop</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full font-bold text-orange-700 bg-orange-100">In Shop</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <svg className="w-8 h-2" viewBox="0 0 40 8"><path d="M0 4 H32 M30 1 L36 4 L30 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                Mark complete
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold text-green-700 bg-green-100">Available</span>
            </div>
            <p className="text-[11px] font-medium mt-2" style={{ color: '#c2410c' }}>
              ⚠ Note: In Shop vehicles are removed from the dispatch pool.
            </p>
          </div>
        </Card>

        {/* Service Logs */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
            <h3 className="text-base font-bold text-foreground">Service Logs</h3>
            <span className="text-xs text-muted-foreground">{logs.length} record{logs.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Vehicle', 'Service', 'Cost (₹)', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-sm">No service logs yet. Add one from the form.</td></tr>
                ) : logs.map((l, i) => {
                  const s = STATUS_STYLES[l.status] || STATUS_STYLES['Completed']
                  return (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="px-5 py-3 font-semibold" style={{ color: '#714b67' }}>{l.vehicle}</td>
                      <td className="px-5 py-3 text-foreground">{l.service}</td>
                      <td className="px-5 py-3 font-semibold text-foreground">₹{l.cost}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{l.date}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleStatus(i)}
                          className="px-3 py-1 rounded-full text-xs font-bold border transition-all hover:opacity-80 cursor-pointer"
                          style={{ background: s.bg, color: s.color, borderColor: s.border }}
                          title="Click to toggle status">
                          {l.status}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
