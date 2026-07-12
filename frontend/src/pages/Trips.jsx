import { useState, useEffect } from 'react'
import { GradientBanner, Card } from '../components/UI'
import { getTrips, createTrip, completeTrip, cancelTrip } from '../services/tripServce'
import { getVehicles } from '../services/vehicleService'
import { getDrivers } from '../services/driverService'

// LIFECYCLE will be dynamic now
const STATUS_STYLES = {
  'Draft':      { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
  'Dispatched': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  'Completed':  { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'Cancelled':  { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
}

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])

  const [form, setForm] = useState({ source: '', dest: '', vehicle: '', driver: '', cargo: '', distance: '' })
  const [validation, setValidation] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [finalStepLabel, setFinalStepLabel] = useState('Completed')

  const LIFECYCLE = ['Draft', 'Dispatched', finalStepLabel]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        getTrips(), getVehicles(), getDrivers()
      ])
      
      if (tripsRes.success && tripsRes.trips) {
        setTrips(tripsRes.trips.map(mapTripData))
      }
      
      let vList = []
      if (Array.isArray(vehiclesRes)) vList = vehiclesRes
      else if (vehiclesRes && vehiclesRes.success && vehiclesRes.vehicles) vList = vehiclesRes.vehicles
      
      if (vList.length > 0) {
        // filter for UI
        setVehicles(vList.filter(v => !['Retired', 'In Shop', 'On Trip'].includes(v.status)))
      }
      
      let drvList = []
      if (Array.isArray(driversRes)) drvList = driversRes
      else if (driversRes.success && driversRes.drivers) drvList = driversRes.drivers

      if (drvList.length > 0) {
        setDrivers(drvList.filter(d => !['Suspended', 'On Trip'].includes(d.status) && new Date(d.license_expiry) >= new Date()))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  function mapTripData(t) {
    return {
      dbId: t.id,
      id: `TR${String(t.id).padStart(3, '0')}`,
      source: t.source,
      dest: t.destination,
      vehicle: t.vehicle ? (t.vehicle.name || t.vehicle.registration_no || t.vehicle.id) : 'Unassigned',
      driver: t.driver ? t.driver.name : 'Unassigned',
      status: t.status,
      eta: t.status === 'Completed' ? 'Arrived' : (t.status === 'Cancelled' ? 'Cancelled' : 'In transit')
    }
  }

  async function handleDispatch() {
    if (!form.source || !form.dest || !form.vehicle || !form.driver) {
      setValidation({ type: 'error', msg: 'All fields are required before dispatching.' }); return
    }
    const cargo = parseFloat(form.cargo) || 0
    const vehicle = vehicles.find(v => String(v.id) === String(form.vehicle))
    const capacity = vehicle ? parseFloat(vehicle.max_load_capacity || 0) : 0
    
    if (vehicle && cargo > capacity) {
      setValidation({
        type: 'capacity',
        vehicleCap: capacity,
        cargo,
        excess: cargo - capacity,
      })
      return
    }

    try {
      const res = await createTrip({
        source: form.source,
        destination: form.dest,
        cargoWeight: form.cargo,
        plannedDistance: form.distance,
        vehicleId: form.vehicle,
        driverId: form.driver
      })

      if (res.success) {
        setForm({ source: '', dest: '', vehicle: '', driver: '', cargo: '', distance: '' })
        setValidation({ type: 'success', msg: `Trip dispatched successfully!` })
        setActiveStep(1)
        fetchData()
      } else {
        setValidation({ type: 'error', msg: res.error || res.message || 'Failed to dispatch' })
      }
    } catch (err) {
      setValidation({ type: 'error', msg: err.message || 'Failed to dispatch' })
    }
  }

  async function handleComplete(dbId) {
    try {
      const res = await completeTrip(dbId, { actualDistance: 0 })
      if (res.success || res.trip) {
        setFinalStepLabel('Completed')
        setActiveStep(2)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCancel(dbId) {
    try {
      const res = await cancelTrip(dbId)
      if (res.success || res.trip) {
        setFinalStepLabel('Cancelled')
        setActiveStep(2)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
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
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name || v.registration_no || v.id} — {v.max_load_capacity || 0} kg capacity</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Driver <span className="normal-case text-[11px] text-green-600 font-normal">(Available only)</span></label>
              <select value={form.driver} onChange={e => setForm(p => ({...p, driver: e.target.value}))} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select driver...</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
            {trips.length === 0 && (
               <p className="text-sm text-muted-foreground text-center py-4">No trips found.</p>
            )}
            {trips.map((t) => {
              const s = STATUS_STYLES[t.status] || STATUS_STYLES['Draft']
              return (
                <div key={t.dbId} className="border border-border rounded-xl p-4 hover:shadow-sm hover:border-primary/30 transition-all">
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
                      {t.status === 'Dispatched' && (
                        <div className="mt-2 flex gap-2 justify-end">
                          <button onClick={() => handleComplete(t.dbId)} className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-[10px] font-bold uppercase transition-colors">Complete</button>
                          <button onClick={() => handleCancel(t.dbId)} className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[10px] font-bold uppercase transition-colors">Cancel</button>
                        </div>
                      )}
                      {t.status === 'Draft' && (
                        <div className="mt-2 flex gap-2 justify-end">
                          <button onClick={() => handleCancel(t.dbId)} className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[10px] font-bold uppercase transition-colors">Cancel</button>
                        </div>
                      )}
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

