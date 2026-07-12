export default function Analytics() {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h2>
        <select className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none cursor-pointer">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm-1-7V7h2v5h-2z" /></svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Fuel Efficiency</h3>
          <p className="text-3xl font-bold text-foreground mt-2">12.4 <span className="text-lg font-normal text-muted-foreground">km/L</span></p>
          <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            2.1% from last month
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12m-6-10h.01M9 16v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5h7z" /></svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Fleet Utilization</h3>
          <p className="text-3xl font-bold text-foreground mt-2">84%</p>
          <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            5% from last month
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Operational Cost</h3>
          <p className="text-3xl font-bold text-foreground mt-2">$2,450</p>
          <p className="text-xs text-red-500 font-medium mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            1.2% from last month
          </p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <svg className="w-16 h-16 text-muted-foreground/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <span className="font-medium text-lg text-foreground">Interactive Charts UI (Placeholder)</span>
        <span className="text-sm text-muted-foreground mt-2 max-w-md">Detailed visual analytics will be rendered here using a charting library like Recharts or Chart.js.</span>
      </div>
    </section>
  )
}
