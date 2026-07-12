import { useState } from 'react'
import { GradientBanner, Card } from '../components/UI'

const LIFECYCLE = ['Draft', 'Dispatched', 'Completed', 'Cancelled']
const STATUS_STYLES = {
  'Draft':      { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
  'Dispatched': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  'Completed':  { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'Cancelled':  { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
}

// Only available vehicles (not In Shop / Retired)
const AVAILABLE_VEHICLES = [
  { id: 'VAN-05',   capacity: 500 },
  { id: 'VAN-09',   capacity: 850 },
]
const AVAILABLE_DRIVERS = ['Alex', 'Suresh']

const INITIAL_TRIPS = [
  { id: 'TR001', source: 'Gandhinagar Depot', dest: 'Ahmedabad Hub',       vehicle: 'VAN-05',    driver: 'Alex',   status: 'Dispatched', eta: '45 min' },
  { id: 'TR004', source: 'Vatva Industrial Area', dest: 'Sanand Warehouse', vehicle: 'TRUCK-04',  driver: 'Suresh', status: 'Draft',      eta: 'Awaiting driver' },
  { id: 'TR006', source: 'Mansa', dest: 'Kalol Depot',                     vehicle: 'Unassigned', driver: 'Alex',  status: 'Cancelled',  eta: 'Vehicle sent for repair' },
]

export default function Trips() {
  const [trips, setTrips] = useState(INITIAL_TRIPS)
  const [form, setForm] = useState({ source: '', dest: '', vehicle: '', driver: '', cargo: '', distance: '' })
  const [validation, setValidation] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  function handleDispatch() {
    if (!form.source || !form.dest || !form.vehicle || !form.driver) {
      setValidation({ type: 'error', msg: 'All fields are required before dispatching.' }); return
    }
    const cargo = parseFloat(form.cargo) || 0
    const vehicle = AVAILABLE_VEHICLES.find(v => v.id === form.vehicle)
    if (vehicle && cargo > vehicle.capacity) {
      setValidation({
        type: 'capacity',
        vehicleCap: vehicle.capacity,
        cargo,
        excess: cargo - vehicle.capacity,
      })
      return
    }
    const newTrip = {
      id: `TR${String(trips.length + 1).padStart(3, '0')}`,
      source: form.source, dest: form.dest,
      vehicle: form.vehicle, driver: form.driver,
      status: 'Dispatched', eta: `${Math.floor(Math.random() * 60) + 20} min`,
    }
    setTrips(prev => [newTrip, ...prev])
    setForm({ source: '', dest: '', vehicle: '', driver: '', cargo: '', distance: '' })
    setValidation({ type: 'success', msg: `Trip ${newTrip.id} dispatched successfully!` })
    setActiveStep(1)
  }

  const inputCls = "block w-full px-3 py-2.5 border border-border rounded-lg text-sm text-foreground bg-white placeholder:text-muted-foreground focus:outline-none hover:border-primary/40 transition-colors"
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"

  return (
    <section className="space-y-5">
      <GradientBanner title="Trip Dispatcher" subtitle="Create and monitor all trip assignments in real-time" />

      {/* Trip Lifecycle Stepper */}
      <Card className="px-6 py-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Trip Lifecycle</p>
        <div className="flex items-center gap-0">
          {LIFECYCLE.map((step, i) => {
            const isActive = i === activeStep
            const isDone   = i < activeStep
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setActiveStep(i)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all border-2"
                    style={{
                      background: isDone ? '#714b67' : isActive ? 'linear-gradient(135deg,#714b67,#432c3d)' : '#f0e8ef',
                      color: isDone || isActive ? '#fff' : '#714b67',
                      borderColor: isDone || isActive ? '#714b67' : '#e4d5e1',
                    }}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                </div>
                {i < LIFECYCLE.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 mb-5 rounded" style={{ background: i < activeStep ? '#714b67' : '#e4d5e1' }} />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Create Trip */}
        <Card className="p-6">
          <h4 className="text-base font-bold text-foreground mb-5">Create Trip</h4>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Source</label>
              <input value={form.source} onChange={e => setForm(p => ({...p, source: e.target.value}))} placeholder="e.g. Gandhinagar Depot" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Destination</label>
              <input value={form.dest} onChange={e => setForm(p => ({...p, dest: e.target.value}))} placeholder="e.g. Ahmedabad Hub" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Vehicle <span className="normal-case text-[11px] text-green-600 font-normal">(Available only)</span></label>
              <select value={form.vehicle} onChange={e => setForm(p => ({...p, vehicle: e.target.value}))} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select vehicle...</option>
                {AVAILABLE_VEHICLES.map(v => <option key={v.id} value={v.id}>{v.id} — {v.capacity} kg capacity</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Driver <span className="normal-case text-[11px] text-green-600 font-normal">(Available only)</span></label>
              <select value={form.driver} onChange={e => setForm(p => ({...p, driver: e.target.value}))} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select driver...</option>
                {AVAILABLE_DRIVERS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Cargo Weight (kg)</label>
                <input type="number" value={form.cargo} onChange={e => setForm(p => ({...p, cargo: e.target.value}))} placeholder="e.g. 300" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Planned Distance (km)</label>
                <input type="number" value={form.distance} onChange={e => setForm(p => ({...p, distance: e.target.value}))} placeholder="e.g. 85" className={inputCls} />
              </div>
            </div>

            {/* Validation Box */}
            {validation && (
              <div className={`p-3 rounded-lg text-sm border ${validation.type === 'capacity' ? 'bg-red-50 border-red-300 text-red-700' : validation.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                {validation.type === 'capacity' ? (
                  <ul className="space-y-0.5 text-xs font-medium">
                    <li>Vehicle Capacity: <strong>{validation.vehicleCap} kg</strong></li>
                    <li>Cargo Weight: <strong>{validation.cargo} kg</strong></li>
                    <li className="text-red-700 font-bold">✗ Capacity exceeded by {validation.excess} kg → dispatch cancelled</li>
                  </ul>
                ) : <p className="font-medium">{validation.msg}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={handleDispatch}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold shadow transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(90deg,#714b67,#432c3d)' }}>
                Dispatch Manually
              </button>
              <button onClick={() => { setForm({ source:'',dest:'',vehicle:'',driver:'',cargo:'',distance:'' }); setValidation(null) }}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:bg-secondary transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Card>

        {/* Live Board */}
        <Card className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-foreground">Live Board</h4>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Live
            </span>
          </div>
          <div className="flex-1 space-y-3">
            {trips.map((t) => {
              const s = STATUS_STYLES[t.status] || STATUS_STYLES['Draft']
              return (
                <div key={t.id} className="border border-border rounded-xl p-4 hover:shadow-sm hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#714b67' }}>{t.id}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{t.source} → {t.dest}</p>
                      <span className="mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border"
                        style={{ background: s.bg, color: s.color, borderColor: s.border }}>{t.status}</span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                      <p className="font-medium">{t.vehicle} / {t.driver}</p>
                      <p className="mt-1">{t.eta}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              ℹ On Completing a trip → Fuel log → Expenses → Vehicle &amp; Driver available
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
