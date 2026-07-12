import { GradientBanner, Card } from '../components/UI'

const kpiCards = [
  {
    label: "Fuel Efficiency", value: "12.4", unit: "km/L",
    trend: "+2.1%", up: true,
    icon: "M12 21a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm-1-7V7h2v5h-2z",
    color: "#714b67", light: "#f3eaf1",
  },
  {
    label: "Fleet Utilization", value: "84", unit: "%",
    trend: "+5%", up: true,
    icon: "M5 16V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12m-6-10h.01M9 16v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5h7z",
    color: "#16a34a", light: "#dcfce7",
  },
  {
    label: "Operational Cost", value: "$2,450", unit: "",
    trend: "-1.2%", up: false,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#ea580c", light: "#ffedd5",
  },
]

const barData = [
  { label: "Mon", fuel: 65, trips: 40 },
  { label: "Tue", fuel: 78, trips: 55 },
  { label: "Wed", fuel: 54, trips: 32 },
  { label: "Thu", fuel: 90, trips: 70 },
  { label: "Fri", fuel: 82, trips: 60 },
  { label: "Sat", fuel: 45, trips: 25 },
  { label: "Sun", fuel: 30, trips: 15 },
]

export default function Analytics() {
  return (
    <section className="space-y-5">
      <GradientBanner title="Reports & Analytics" subtitle="Visual insights into your fleet performance">
        <select className="text-white/80 border border-white/25 bg-white/10 text-sm rounded-lg px-3 py-2 cursor-pointer appearance-none focus:outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This Year</option>
        </select>
      </GradientBanner>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCards.map((k, i) => (
          <Card key={i} className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-8 pointer-events-none">
              <svg className="w-16 h-16" style={{ color: k.color }} fill="currentColor" viewBox="0 0 24 24">
                <path d={k.icon} />
              </svg>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: k.light }}>
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
              {k.trend} from last month
            </p>
          </Card>
        ))}
      </div>

      {/* Bar Chart Mockup */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-foreground">Weekly Overview</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#714b67' }} />Fuel Cost</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#c4a0ba' }} />Trips</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {barData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '120px' }}>
                <div className="flex-1 rounded-t-md transition-all" style={{ height: `${d.fuel}%`, background: 'linear-gradient(180deg,#714b67,#432c3d)' }} />
                <div className="flex-1 rounded-t-md transition-all" style={{ height: `${d.trips}%`, background: '#e4d5e1' }} />
              </div>
              <span className="text-xs text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Placeholder for full chart */}
      <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[180px]">
        <svg className="w-12 h-12 mb-3" style={{ color: '#c4a0ba' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p className="font-semibold text-foreground">Interactive Charts — Coming Soon</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">Detailed visual analytics will be rendered here using Recharts or Chart.js.</p>
      </Card>
    </section>
  )
}
