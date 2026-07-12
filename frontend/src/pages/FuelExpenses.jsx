import { useState } from 'react'
import { GradientBanner, Card } from '../components/UI'

const STATUS_STYLES = {
  'Available':  { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  'Completed':  { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  'On Trip':    { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
}

const INITIAL_FUEL = [
  { vehicle: 'VAN-05',   date: '05 Jul 2026', liters: '42 L',  amount: 3150 },
  { vehicle: 'TRUCK-11', date: '06 Jul 2026', liters: '110 L', amount: 9400 },
  { vehicle: 'MINI-09',  date: '06 Jul 2026', liters: '28 L',  amount: 2050 },
]

const INITIAL_EXPENSES = [
  { trip: 'TR001', vehicle: 'VAN-05',   toll: 120, other: 0,   maintLinked: 0,      status: 'Available' },
  { trip: 'TR001', vehicle: 'TRK-12',   toll: 340, other: 150, maintLinked: 18000,  status: 'Completed' },
]

export default function FuelExpenses() {
  const [fuel, setFuel] = useState(INITIAL_FUEL)
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [showFuelModal, setShowFuelModal] = useState(false)
  const [showExpModal, setShowExpModal] = useState(false)
  const [fuelForm, setFuelForm] = useState({ vehicle: 'VAN-05', date: '', liters: '', amount: '' })
  const [expForm, setExpForm] = useState({ trip: '', vehicle: 'VAN-05', toll: '', other: '', status: 'Available' })

  function addFuel() {
    if (!fuelForm.date || !fuelForm.liters || !fuelForm.amount) return
    setFuel(p => [...p, { ...fuelForm, liters: fuelForm.liters + ' L', amount: parseFloat(fuelForm.amount) }])
    setShowFuelModal(false)
    setFuelForm({ vehicle: 'VAN-05', date: '', liters: '', amount: '' })
  }

  function addExpense() {
    if (!expForm.trip) return
    setExpenses(p => [...p, { ...expForm, toll: parseFloat(expForm.toll) || 0, other: parseFloat(expForm.other) || 0, maintLinked: 0 }])
    setShowExpModal(false)
    setExpForm({ trip: '', vehicle: 'VAN-05', toll: '', other: '', status: 'Available' })
  }

  const totalFuel = fuel.reduce((a, f) => a + (parseFloat(String(f.amount).replace(/,/g,'')) || 0), 0)
  const totalExp  = expenses.reduce((a, e) => a + (e.toll||0) + (e.other||0) + (e.maintLinked||0), 0)
  const grandTotal = totalFuel + totalExp

  const inputCls = "block w-full px-3 py-2.5 border border-border rounded-lg text-sm text-foreground bg-white placeholder:text-muted-foreground focus:outline-none"
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"

  return (
    <section className="space-y-5">
      <GradientBanner title="Fuel & Expense Management" subtitle="Monitor fuel consumption and operational costs">
        <div className="flex gap-2">
          <button onClick={() => setShowFuelModal(true)}
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            + Log Fuel
          </button>
          <button onClick={() => setShowExpModal(true)}
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            + Add Expense
          </button>
        </div>
      </GradientBanner>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel Cost', value: `₹${totalFuel.toLocaleString('en-IN')}`, color: '#714b67', light: '#f3eaf1' },
          { label: 'Other Expenses',  value: `₹${totalExp.toLocaleString('en-IN')}`,  color: '#c2410c', light: '#ffedd5' },
          { label: 'Grand Total',     value: `₹${grandTotal.toLocaleString('en-IN')}`, color: '#15803d', light: '#dcfce7' },
        ].map(c => (
          <Card key={c.label} className="px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.light }}>
              <svg className="w-5 h-5" style={{ color: c.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
              <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Fuel Logs */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/20 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Fuel Logs</h3>
          <span className="text-xs text-muted-foreground">{fuel.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Vehicle', 'Date', 'Liters', 'Amount (₹)'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fuel.map((f, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-3 font-semibold" style={{ color: '#714b67' }}>{f.vehicle}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{f.date}</td>
                  <td className="px-5 py-3 text-foreground">{f.liters}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">₹{typeof f.amount === 'number' ? f.amount.toLocaleString('en-IN') : f.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Other Expenses */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/20 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Other Expenses (Toll / Misc)</h3>
          <span className="text-xs text-muted-foreground">{expenses.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Trip', 'Vehicle', 'Toll (₹)', 'Other (₹)', 'Maint. (Linked)', 'Total', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => {
                const total = (e.toll||0) + (e.other||0) + (e.maintLinked||0)
                const s = STATUS_STYLES[e.status] || STATUS_STYLES['Available']
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: '#714b67' }}>{e.trip}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{e.vehicle}</td>
                    <td className="px-4 py-3 text-foreground">₹{(e.toll||0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-foreground">₹{(e.other||0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-foreground">₹{(e.maintLinked||0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-foreground">₹{total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold border" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{e.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Total Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-secondary/10">
          <p className="text-sm font-semibold text-foreground">
            Total Operational Cost (auto) = Fuel + Maint.
          </p>
          <p className="text-lg font-bold" style={{ color: '#714b67' }}>₹{grandTotal.toLocaleString('en-IN')}</p>
        </div>
      </Card>

      {/* Fuel Modal */}
      {showFuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Log Fuel Entry</h3>
              <button onClick={() => setShowFuelModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div><label className={labelCls}>Vehicle</label>
                <select value={fuelForm.vehicle} onChange={e => setFuelForm(p => ({...p, vehicle: e.target.value}))} className={inputCls + " appearance-none cursor-pointer"}>
                  {['VAN-05','TRUCK-11','MINI-09','VAN-09'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Date</label><input type="date" value={fuelForm.date} onChange={e => setFuelForm(p => ({...p, date: e.target.value}))} className={inputCls}/></div>
              <div><label className={labelCls}>Liters</label><input type="number" placeholder="e.g. 42" value={fuelForm.liters} onChange={e => setFuelForm(p => ({...p, liters: e.target.value}))} className={inputCls}/></div>
              <div><label className={labelCls}>Amount (₹)</label><input type="number" placeholder="e.g. 3150" value={fuelForm.amount} onChange={e => setFuelForm(p => ({...p, amount: e.target.value}))} className={inputCls}/></div>
              <button onClick={addFuel} className="w-full py-2.5 rounded-lg text-white text-sm font-bold shadow transition-all hover:opacity-90 mt-1" style={{ background: 'linear-gradient(90deg,#714b67,#432c3d)' }}>Save Fuel Log</button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Add Expense</h3>
              <button onClick={() => setShowExpModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div><label className={labelCls}>Trip ID</label><input placeholder="e.g. TR001" value={expForm.trip} onChange={e => setExpForm(p => ({...p, trip: e.target.value}))} className={inputCls}/></div>
              <div><label className={labelCls}>Vehicle</label>
                <select value={expForm.vehicle} onChange={e => setExpForm(p => ({...p, vehicle: e.target.value}))} className={inputCls + " appearance-none cursor-pointer"}>
                  {['VAN-05','TRUCK-11','MINI-09','VAN-09'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Toll (₹)</label><input type="number" placeholder="0" value={expForm.toll} onChange={e => setExpForm(p => ({...p, toll: e.target.value}))} className={inputCls}/></div>
              <div><label className={labelCls}>Other Expenses (₹)</label><input type="number" placeholder="0" value={expForm.other} onChange={e => setExpForm(p => ({...p, other: e.target.value}))} className={inputCls}/></div>
              <button onClick={addExpense} className="w-full py-2.5 rounded-lg text-white text-sm font-bold shadow transition-all hover:opacity-90 mt-1" style={{ background: 'linear-gradient(90deg,#714b67,#432c3d)' }}>Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
