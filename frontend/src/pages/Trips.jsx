export default function Trips() {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Trip Dispatcher</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Create Trip</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Source</label>
              <input type="text" placeholder="Enter origin..." className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Destination</label>
              <input type="text" placeholder="Enter destination..." className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Cargo Weight (kg)</label>
              <input type="number" placeholder="0.00" className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex items-start mt-2">
              <svg className="w-5 h-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-muted-foreground">Vehicle capacity checks are simulated for UI only.</span>
            </div>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4" disabled>
              Dispatch Trip
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Live Board
          </h4>
          <div className="flex-1 border-2 border-dashed border-border rounded-lg bg-muted/20 flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
            <svg className="w-12 h-12 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="font-medium text-foreground">No active trips</span>
            <span className="text-sm text-muted-foreground mt-1">Dispatched trips will appear here in real-time.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
