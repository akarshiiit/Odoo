// Reusable shared UI primitives for all pages
export const GradientBanner = ({ title, subtitle, children }) => (
  <div
    className="rounded-2xl px-6 py-5 text-white relative overflow-hidden shadow-md mb-6"
    style={{ background: '#432c3d' }}
  >
    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }} />
    <div className="flex items-center justify-between relative z-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-white/65 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  </div>
)

export const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="text-white/80 hover:text-white hover:bg-white/15 border border-white/25 text-sm font-medium px-4 py-2 rounded-lg transition-all"
  >
    {children}
  </button>
)

export const PrimaryBtn = ({ children, onClick, disabled, full }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${full ? 'w-full' : ''} text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed`}
    style={{ background: 'linear-gradient(90deg, #714b67, #432c3d)' }}
  >
    {children}
  </button>
)

export const Card = ({ children, className = '' }) => (
  <div className={`bg-card border border-border rounded-xl shadow-sm ${className}`}>{children}</div>
)

export const CardHeader = ({ children }) => (
  <div className="px-5 py-4 border-b border-border flex items-center justify-between">{children}</div>
)

export const CardTitle = ({ children }) => (
  <h3 className="text-base font-semibold text-foreground">{children}</h3>
)

export const FormInput = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-muted-foreground mb-1.5">{label}</label>}
    <input
      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground transition-all"
      {...props}
    />
  </div>
)

export const FormSelect = ({ label, children, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-muted-foreground mb-1.5">{label}</label>}
    <select
      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm cursor-pointer transition-all appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
)

export const SearchInput = ({ placeholder }) => (
  <div className="relative w-full max-w-xs">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder={placeholder || 'Search...'}
      className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground transition-all"
    />
  </div>
)

export const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(113,75,103,0.12), rgba(67,44,61,0.06))' }}>
      <svg className="w-8 h-8" style={{ color: '#714b67' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </div>
    <p className="font-semibold text-foreground text-base">{title}</p>
    {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{subtitle}</p>}
  </div>
)

export const TableHead = ({ columns }) => (
  <thead>
    <tr className="border-b border-border">
      {columns.map(c => (
        <th key={c} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/40">{c}</th>
      ))}
    </tr>
  </thead>
)
