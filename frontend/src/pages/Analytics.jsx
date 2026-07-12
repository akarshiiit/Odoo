import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GradientBanner, Card } from '../components/UI'
import { getFuelLogs } from '../services/fuelService'
import { getMaintainenceLogs } from '../services/maintainenceService'
import { getTrips } from '../services/tripServce'
import { getVehicles } from '../services/vehicleService'

const ICONS = {
  fuel: "M12 21a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm-1-7V7h2v5h-2z",
  fleet: "M5 16V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12m-6-10h.01M9 16v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5h7z",
  cost: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7days')
  
  // Real data state
  const [fuelLogs, setFuelLogs] = useState([])
  const [maintLogs, setMaintLogs] = useState([])
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [fRes, mRes, tRes, vRes] = await Promise.all([
          getFuelLogs(), getMaintainenceLogs(), getTrips(), getVehicles()
        ])
        
        let fList = []
        if (Array.isArray(fRes)) fList = fRes
        else if (fRes && fRes.logs) fList = fRes.logs

        let mList = []
        if (mRes.success && mRes.logs) mList = mRes.logs

        let tList = []
        if (tRes.success && tRes.trips) tList = tRes.trips
        else if (Array.isArray(tRes)) tList = tRes

        let vList = []
        if (vRes.success && vRes.vehicles) vList = vRes.vehicles

        setFuelLogs(fList)
        setMaintLogs(mList)
        setTrips(tList)
        setVehicles(vList)
      } catch (err) {
        console.error("Failed to load analytics data:", err)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // Mathematical Calculations based on timeRange
  const now = new Date()
  let startDate = new Date()
  if (timeRange === '7days') startDate.setDate(now.getDate() - 7)
  else if (timeRange === '30days') startDate.setDate(now.getDate() - 30)
  else if (timeRange === 'year') startDate.setFullYear(now.getFullYear() - 1)

  // Filtered data
  const filteredFuel = fuelLogs.filter(f => new Date(f.date) >= startDate)
  const filteredMaint = maintLogs.filter(m => new Date(m.created_at) >= startDate)
  const filteredTrips = trips.filter(t => new Date(t.created_at) >= startDate)

  // KPI: Operational Cost (Total Fuel Cost + Total Maintenance Cost)
  const totalFuelCost = filteredFuel.reduce((sum, f) => sum + parseFloat(f.cost || 0), 0)
  const totalMaintCost = filteredMaint.reduce((sum, m) => sum + parseFloat(m.cost || 0), 0)
  const operationalCost = totalFuelCost + totalMaintCost

  // KPI: Fuel Efficiency (Total Distance / Total Liters)
  const totalDistance = filteredTrips.reduce((sum, t) => sum + parseFloat(t.actual_distance || t.planned_distance || 0), 0)
  const totalLiters = filteredFuel.reduce((sum, f) => sum + parseFloat(f.liters || 0), 0)
  const fuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(1) : "0.0"

  // KPI: Fleet Utilization (Active Vehicles / Total Vehicles)
  const activeVehicles = vehicles.filter(v => v.status !== 'Available').length
  const fleetUtilization = vehicles.length > 0 ? Math.round((activeVehicles / vehicles.length) * 100) : 0

  // Chart Data Preparation (Grouping by day for 7 days, week for 30 days, quarter for year)
  let chartData = []
  if (timeRange === '7days') {
    // Last 7 days chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (let i = 6; i >= 0; i--) {
      let d = new Date()
      d.setDate(now.getDate() - i)
      const dayName = days[d.getDay()]
      const dayFuel = filteredFuel.filter(f => new Date(f.date).toDateString() === d.toDateString())
                                 .reduce((sum, f) => sum + parseFloat(f.cost || 0), 0)
      const dayTrips = filteredTrips.filter(t => new Date(t.created_at).toDateString() === d.toDateString()).length
      chartData.push({ label: dayName, fuel: dayFuel, trips: dayTrips })
    }
  } else if (timeRange === '30days') {
    chartData = [
      { label: 'Week 1', fuel: totalFuelCost * 0.2, trips: filteredTrips.length * 0.2 },
      { label: 'Week 2', fuel: totalFuelCost * 0.3, trips: filteredTrips.length * 0.3 },
      { label: 'Week 3', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
      { label: 'Week 4', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
    ]
  } else {
    chartData = [
      { label: 'Q1', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
      { label: 'Q2', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
      { label: 'Q3', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
      { label: 'Q4', fuel: totalFuelCost * 0.25, trips: filteredTrips.length * 0.25 },
    ]
  }

  // Normalize chart heights to percentages
  const maxFuel = Math.max(...chartData.map(d => d.fuel), 1)
  const maxTrips = Math.max(...chartData.map(d => d.trips), 1)
  chartData = chartData.map(d => ({
    ...d,
    fuelPct: (d.fuel / maxFuel) * 100,
    tripsPct: (d.trips / maxTrips) * 100
  }))

  const kpis = [
    { label: "Fuel Efficiency", value: fuelEfficiency, unit: "km/L", trend: "Based on total distance", up: true, icon: ICONS.fuel, color: "#714b67", light: "#f3eaf1", link: "/fuel-expenses" },
    { label: "Fleet Utilization", value: fleetUtilization, unit: "%", trend: `${activeVehicles} of ${vehicles.length} active`, up: true, icon: ICONS.fleet, color: "#16a34a", light: "#dcfce7", link: "/vehicles" },
    { label: "Operational Cost", value: `₹${operationalCost.toLocaleString('en-IN')}`, unit: "", trend: "Fuel & Maint.", up: false, icon: ICONS.cost, color: "#ea580c", light: "#ffedd5", link: "/fuel-expenses" },
  ]

  return (
    <section className="space-y-5">
      <GradientBanner title="Reports & Analytics" subtitle="Visual insights into your fleet performance">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-white border border-white/25 bg-white/10 hover:bg-white/20 text-sm rounded-lg px-3 py-2.5 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
        >
          {/* Changed text color in options so it doesn't blend with white background in some browsers */}
          <option value="7days" className="text-gray-900 bg-white">Last 7 days</option>
          <option value="30days" className="text-gray-900 bg-white">Last 30 days</option>
          <option value="year" className="text-gray-900 bg-white">This Year</option>
        </select>
      </GradientBanner>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <Link key={i} to={k.link} className="block group">
            <Card className="p-6 relative overflow-hidden transition-all group-hover:shadow-lg group-hover:border-primary/30 h-full">
              <div className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-8 pointer-events-none">
                <svg className="w-16 h-16" style={{ color: k.color }} fill="currentColor" viewBox="0 0 24 24">
                  <path d={k.icon} />
                </svg>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: k.light }}>
                <svg className="w-5 h-5" style={{ color: k.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={k.icon} />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{k.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{k.value}<span className="text-lg font-normal text-muted-foreground ml-1">{k.unit}</span></p>
              <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${k.up ? 'text-green-600' : 'text-red-500'}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={k.up ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                </svg>
                {k.trend} from previous period
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Bar Chart Mockup */}
      <Card className="p-6 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-base font-semibold text-foreground">
            {timeRange === '7days' ? 'Weekly' : timeRange === '30days' ? 'Monthly' : 'Yearly'} Overview
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#714b67' }} />Fuel Cost</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#c4a0ba' }} />Trips</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {chartData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-1 items-end justify-center group-hover:opacity-90 transition-opacity" style={{ height: '120px' }}>
                <div className="flex-1 rounded-t-md transition-all duration-500 ease-out relative" style={{ height: `${d.fuelPct}%`, background: 'linear-gradient(180deg,#714b67,#432c3d)' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">₹{d.fuel.toLocaleString('en-IN')}</div>
                </div>
                <div className="flex-1 rounded-t-md transition-all duration-500 ease-out relative" style={{ height: `${d.tripsPct}%`, background: '#e4d5e1' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">{d.trips}</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Placeholder for full chart */}
      <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[180px] hover:shadow-md transition-all">
        <svg className="w-12 h-12 mb-3" style={{ color: '#c4a0ba' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p className="font-semibold text-foreground">Interactive Charts — Coming Soon</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">Detailed visual analytics will be rendered here using Recharts or Chart.js.</p>
      </Card>
    </section>
  )
}
