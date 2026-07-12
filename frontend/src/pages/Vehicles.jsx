import { useState, useEffect } from 'react'
import { GradientBanner, PrimaryBtn, Card } from '../components/UI'
import { getVehicles, createVehicle } from '../services/vehicleService'

const STATUS_STYLES = {
  'Available': { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'On Trip': { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  'In Shop': { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
  'Retired': { bg: '#fce7f3', color: '#9d174d', border: '#f9a8d4' },
}

const TYPES = ['All', 'Van', 'Truck', 'Mini']
const STATUSES = ['All', 'Available', 'On Trip', 'In Shop', 'Retired']

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    registration_no: "",
    name: "",
    type: "Van",
    max_load_capacity: "",
    odometer: "",
    acquisition_cost: "",
    status: "Available"
  });
  const [formError, setFormError] = useState('')

  //Fetching all vehicles from the backend API
  useEffect(() => {

    const fetchVehicles = async () => {

      try {

        const data = await getVehicles();

        console.log(data);

        setVehicles(data.vehicles || data);

      } catch (error) {

        console.log(error.message);

      }

    };

    fetchVehicles();

  }, []);

  const filtered = vehicles.filter(v => {
    const matchType = typeFilter === 'All' || v.type === typeFilter
    const matchStatus = statusFilter === 'All' || v.status === statusFilter
    const matchSearch = v.registration_no.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchStatus && matchSearch
  })

  async function handleAdd() {

    try {
      const data = await createVehicle(form);
      setVehicles(prev => [
        ...prev,
        data.vehicle || data
      ]);

      setShowModal(false);
      setForm({
        registration_no: "",
        name: "",
        type: "Van",
        max_load_capacity: "",
        odometer: "",
        acquisition_cost: "",
        status: "Available"
      });

      setFormError("");
    }
    catch (error) {
      setFormError(error.message);
    }
  }

  const selectCls = "text-sm px-3 py-2 rounded-lg border border-border bg-white text-foreground cursor-pointer appearance-none focus:outline-none hover:border-primary/50 transition-colors"

  return (
    <section className="space-y-5">
      <GradientBanner title="Vehicle Registry" subtitle="Manage your entire fleet in one place">
        <button
          onClick={() => { setShowModal(true); setFormError('') }}
          className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Vehicle
        </button>
      </GradientBanner>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectCls}>
          {TYPES.map(t => <option key={t}>Type: {t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectCls}>
          {STATUSES.map(s => <option key={s}>Status: {s}</option>)}
        </select>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Reg. No..." className="pl-10 pr-3 py-2 border border-border rounded-lg bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none hover:border-primary/50 transition-colors w-52" />
        </div>
        <div className="ml-auto">
          <PrimaryBtn onClick={() => { setShowModal(true); setFormError('') }}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              + Add Vehicle
            </span>
          </PrimaryBtn>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Reg. No / Unique', 'Name/Model', 'Type', 'Capacity', 'Odometer', 'Avg. Cost', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No vehicles match the selected filters.</td></tr>
              ) : filtered.map((v, i) => {
                const s = STATUS_STYLES[v.status] || STATUS_STYLES['Available']
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-bold" style={{ color: '#714b67' }}>{v.registration_no}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{v.name}</td>
                    <td className="px-5 py-3 text-foreground">{v.type}</td>
                    <td className="px-5 py-3 text-foreground">{v.max_load_capacity}</td>
                    <td className="px-5 py-3 text-foreground">{v.odometer}</td>
                    <td className="px-5 py-3 text-foreground">₹{v.acquisition_cost}</td>
                    <td className="px-5 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-border bg-secondary/10">
          <p className="text-xs font-medium" style={{ color: '#c2410c' }}>
            ⚠ Rule: Registration No must be unique / Retired &amp; In Shop vehicles are hidden from Trip Dispatcher.
          </p>
        </div>
      </Card>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Add New Vehicle</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              {[
                ['Registration No', 'registration_no', 'text', 'GJ01CD456'],
                ['Vehicle Name', 'name', 'text', 'VAN-10'],
                ['Max Load Capacity', 'max_load_capacity', 'number', '500'],
                ['Odometer', 'odometer', 'number', '0'],
                ['Acquisition Cost', 'acquisition_cost', 'number', '500000']
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="block w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="block w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground appearance-none cursor-pointer focus:outline-none">
                  {['Van', 'Truck', 'Mini', 'Bus'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {formError && <p className="text-xs font-medium text-red-500">{formError}</p>}
              <PrimaryBtn full onClick={handleAdd}>Add Vehicle</PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
