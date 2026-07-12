import { Link } from 'react-router-dom'

export default function Auth() {
  return (
    <div className="min-h-screen flex" style={{ background: '#f8f5f9' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #714b67 0%, #432c3d 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c084fc, transparent 70%)' }} />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">TransitOps</h1>
          <p className="mt-2 text-white/65 text-base">Smart Transport Operations Platform</p>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-white/80 text-lg font-medium leading-relaxed">
            "Everything you need to run your fleet — in one place."
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"].map(r => (
              <div key={r} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-sm font-medium text-white/85">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs">© 2026 TransitOps. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back 👋</h2>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your TransitOps account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@transitops.com"
                className="block w-full px-4 py-3 border border-border rounded-xl bg-white text-foreground text-sm placeholder:text-muted-foreground transition-all shadow-sm"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                <a href="#" className="text-xs font-medium" style={{ color: '#714b67' }}>Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="block w-full px-4 py-3 border border-border rounded-xl bg-white text-foreground text-sm placeholder:text-muted-foreground transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Role</label>
              <select className="block w-full px-4 py-3 border border-border rounded-xl bg-white text-foreground text-sm cursor-pointer appearance-none transition-all shadow-sm">
                <option>Dispatcher</option>
                <option>Fleet Manager</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>

            <Link
              to="/dashboard"
              className="flex w-full items-center justify-center py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition-all mt-2"
              style={{ background: 'linear-gradient(90deg, #714b67, #432c3d)' }}
            >
              Sign In →
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="font-semibold" style={{ color: '#714b67' }}>Contact your admin</a>
          </p>
        </div>
      </div>
    </div>
  )
}
