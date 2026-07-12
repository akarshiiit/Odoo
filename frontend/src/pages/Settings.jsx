import { GradientBanner, PrimaryBtn, Card, FormInput } from '../components/UI'

const roles = [
  { name: "Fleet Manager",    perms: ["View Fleet", "Edit Fleet", "View Reports"], color: "#714b67" },
  { name: "Dispatcher",       perms: ["Create Trips", "View Trips", "View Fleet"],  color: "#0891b2" },
  { name: "Safety Officer",   perms: ["View Drivers", "View Maintenance"],          color: "#16a34a" },
  { name: "Financial Analyst",perms: ["View Expenses", "View Reports"],             color: "#d97706" },
]

export default function Settings() {
  return (
    <section className="space-y-5">
      <GradientBanner title="Settings & RBAC" subtitle="Configure depot settings and manage user access controls" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Config */}
        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#714b67,#432c3d)' }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37..." />
                </svg>
              </span>
              General Configuration
            </h3>
            <div className="space-y-4">
              <FormInput label="Depot Name" type="text" placeholder="Main HQ Depot" />
              <FormInput label="Contact Email" type="email" placeholder="admin@transitops.com" />
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Currency</label>
                <select className="block w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground cursor-pointer appearance-none">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>INR (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Timezone</label>
                <select className="block w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground cursor-pointer appearance-none">
                  <option>UTC+05:30 (IST)</option>
                  <option>UTC+00:00 (GMT)</option>
                  <option>UTC-05:00 (EST)</option>
                </select>
              </div>
              <PrimaryBtn full>Save Changes</PrimaryBtn>
            </div>
          </Card>

          {/* Notification Prefs */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Notifications</h3>
            <div className="space-y-3">
              {["Trip dispatched", "Maintenance due", "Fuel log added", "Driver assigned"].map(n => (
                <label key={n} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">{n}</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-10 h-5 rounded-full border border-border bg-secondary peer-checked:bg-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: RBAC */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-base font-semibold text-foreground">Role-Based Access Control</h3>
              <PrimaryBtn>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Role
                </span>
              </PrimaryBtn>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map(r => (
                <div key={r.name} className="border border-border rounded-xl p-4 hover:shadow-sm hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: r.color }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.perms.length} permissions</p>
                    </div>
                    <button className="ml-auto text-xs text-primary hover:underline font-medium">Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.perms.map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f3eaf1', color: '#714b67' }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Users */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Active Users</h3>
            <div className="space-y-3">
              {[
                { name: "Raven K.", role: "Dispatcher", email: "raven@transitops.com" },
                { name: "Alex M.", role: "Fleet Manager", email: "alex@transitops.com" },
              ].map(u => (
                <div key={u.name} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#714b67,#432c3d)' }}>
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#f3eaf1', color: '#714b67' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
