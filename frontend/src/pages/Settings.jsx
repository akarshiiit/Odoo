export default function Settings() {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings & RBAC</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">General Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Depot Name</label>
                <input type="text" placeholder="Main HQ Depot" className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Currency</label>
                <select className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm mt-2">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
            <h3 className="text-lg font-semibold text-foreground">Role-Based Access Control</h3>
            <button className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-muted font-medium transition-colors border border-border">
              Add Role
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5 text-center">
            <svg className="w-12 h-12 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium text-foreground">No roles configured yet</span>
            <span className="text-sm text-muted-foreground mt-1 max-w-md">Create roles and assign them to users to manage what they can view and edit across the platform.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
