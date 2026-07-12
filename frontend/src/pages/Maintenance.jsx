export default function Maintenance() {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Maintenance & Service Logs</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Log Service</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Vehicle</label>
              <input type="text" placeholder="Select vehicle..." className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Service Type</label>
              <input type="text" placeholder="e.g. Oil Change, Tire Rotation" className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Cost ($)</label>
              <input type="number" placeholder="0.00" className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm mt-2">
              Save Log
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
            <h3 className="text-lg font-semibold text-foreground">Service History</h3>
            <button className="text-sm text-primary hover:underline">Filter</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5 min-h-[300px] text-center">
             <svg className="w-12 h-12 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="font-medium text-foreground">No maintenance logs found</span>
            <span className="text-sm text-muted-foreground mt-1">Logs will appear here once saved.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
