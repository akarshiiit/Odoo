import { useState, useEffect } from 'react'
import { GradientBanner, GhostBtn, Card } from '../components/UI'
import { getVehicles } from '../services/vehicleService'
import { getTrips } from '../services/tripServce'
import { getDrivers } from '../services/driverService'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [vRes, tRes, dRes] = await Promise.all([
          getVehicles(), getTrips(), getDrivers()
        ])
        
        let vList = []
        if (Array.isArray(vRes)) vList = vRes
        else if (vRes && vRes.success && vRes.vehicles) vList = vRes.vehicles
        setVehicles(vList || [])
        
        let tList = []
        if (Array.isArray(tRes)) tList = tRes
        else if (tRes && tRes.success && tRes.trips) tList = tRes.trips
        setTrips(tList || [])
        
        let drvList = []
        if (Array.isArray(dRes)) drvList = dRes
        else if (dRes && dRes.success && dRes.drivers) drvList = dRes.drivers
        setDrivers(drvList || [])
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length
  const onTripVehicles = vehicles.filter(v => v.status === 'On Trip').length
  const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length
  const retiredVehicles = vehicles.filter(v => v.status === 'Retired').length
  
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length
  const pendingTrips = trips.filter(t => t.status === 'Draft').length
  const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length
  const fleetUtil = totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles - retiredVehicles) / totalVehicles) * 100) : 0

  const stats = [
    { title: "Active Vehicles",       value: totalVehicles.toString(), icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414A1 1 0 0120 8.414V19a2 2 0 01-2 2h-6", color: "#714b67", light: "#f3eaf1" },
    { title: "Available Vehicles",    value: availableVehicles.toString().padStart(2, '0'), icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",                                                               color: "#16a34a", light: "#dcfce7" },
    { title: "In Maintenance",        value: inShopVehicles.toString().padStart(2, '0'), icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", color: "#ea580c", light: "#ffedd5" },
    { title: "Active Trips",          value: activeTrips.toString().padStart(2, '0'), icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", color: "#7c3aed", light: "#ede9fe" },
    { title: "Pending Trips",         value: pendingTrips.toString().padStart(2, '0'), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                                                                color: "#db2777", light: "#fce7f3" },
    { title: "Drivers on Duty",       value: driversOnDuty.toString().padStart(2, '0'), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#0891b2", light: "#cffafe" },
    { title: "Fleet Utilization",     value: `${fleetUtil}%`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#d97706", light: "#fef3c7" },
  ]

  const vehicleStatus = [
    { label: "Available", count: availableVehicles, total: totalVehicles || 1, color: "#16a34a" },
    { label: "On Trip",   count: onTripVehicles,    total: totalVehicles || 1, color: "#714b67" },
    { label: "In Shop",   count: inShopVehicles,    total: totalVehicles || 1, color: "#ea580c" },
    { label: "Retired",   count: retiredVehicles,   total: totalVehicles || 1, color: "#dc2626" },
  ]

  const recentTrips = trips.slice(0, 5).map(t => ({
    id: `TR${String(t.id).padStart(3, '0')}`,
    vehicle: t.vehicle ? (t.vehicle.name || t.vehicle.registration_no || t.vehicle.id) : '—',
    driver: t.driver ? t.driver.name : '—',
    status: t.status,
    statusColor: t.status === 'Completed' ? '#22c55e' : t.status === 'Dispatched' ? '#f97316' : t.status === 'Draft' ? '#6b7280' : '#3b82f6',
    eta: t.status === 'Completed' ? 'Arrived' : (t.status === 'Cancelled' ? 'Cancelled' : 'In transit')
  }))

  return (
    <section className="space-y-5">
      <GradientBanner title="Dashboard" subtitle="Overview of your transit operations">
        <GhostBtn>Generate Report</GhostBtn>
      </GradientBanner>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["Vehicle Type: All", "Status: All", "Region: All"].map(f => (
          <select key={f}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card text-foreground cursor-pointer appearance-none hover:border-primary transition-colors"
          >
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {stats.map((s, i) => (
          <div key={i}
            className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + '15' }}>
              <svg className="w-5 h-5" style={{ color: s.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">{s.title}</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Trips */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Recent Trips</h3>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-85" style={{ background: 'linear-gradient(90deg,#714b67,#432c3d)' }}>View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Trip", "Vehicle", "Driver", "Status", "ETA"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTrips.length === 0 && (
                  <tr><td colSpan="5" className="px-5 py-6 text-center text-muted-foreground">No recent trips found.</td></tr>
                )}
                {recentTrips.map((t, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-primary">{t.id}</td>
                    <td className="px-5 py-3 text-foreground font-medium">{t.vehicle}</td>
                    <td className="px-5 py-3 text-foreground">{t.driver}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: t.statusColor + '20', color: t.statusColor }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{t.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Vehicle Status */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-base font-semibold text-foreground mb-4">Vehicle Status</h3>
          <div className="space-y-4 flex-1">
            {vehicleStatus.map(v => (
              <div key={v.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground font-medium">{v.label}</span>
                  <span className="font-bold text-foreground">{v.count} <span className="text-muted-foreground font-normal text-xs">/ {v.total}</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(v.count / v.total) * 100}%`, background: v.color }} />
                </div>
              </div>
            ))}
          </div>
          {/* Mini Legend */}
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-2">
            {vehicleStatus.map(v => (
              <div key={v.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
                <span className="text-xs text-muted-foreground">{v.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
