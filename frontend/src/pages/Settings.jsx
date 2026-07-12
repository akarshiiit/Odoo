import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GradientBanner, Card } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../components/ThemeContext'

// ─── Data ──────────────────────────────────────────────────────────────────
const ROLES_CONFIG = [
  { name: 'Fleet Manager',     color: '#714b67', perms: ['View Fleet', 'Edit Fleet', 'Add Vehicle', 'View Reports', 'Assign Driver'] },
  { name: 'Dispatcher',        color: '#0891b2', perms: ['Create Trips', 'Edit Trips', 'View Fleet', 'Assign Driver'] },
  { name: 'Safety Officer',    color: '#16a34a', perms: ['View Drivers', 'View Maintenance', 'File Incident', 'View Trips'] },
  { name: 'Financial Analyst', color: '#d97706', perms: ['View Expenses', 'Export Reports', 'View Fuel Logs', 'View Analytics'] },
]

const NOTIF_OPTIONS = [
  { key: 'trip_dispatched',  label: 'Trip dispatched',   desc: 'When a trip is assigned and starts.' },
  { key: 'maintenance_due',  label: 'Maintenance due',   desc: 'Reminder before a vehicle service is due.' },
  { key: 'fuel_added',       label: 'Fuel log added',    desc: 'When a new fuel entry is recorded.' },
  { key: 'driver_assigned',  label: 'Driver assigned',   desc: 'When a driver is assigned to a vehicle.' },
  { key: 'trip_completed',   label: 'Trip completed',    desc: 'Notification when a trip ends.' },
]

// ─── Sub-components ─────────────────────────────────────────────────────────
function SectionTab({ id, label, icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
      </svg>
      {label}
    </button>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`w-10 h-5 rounded-full border transition-colors ${checked ? 'bg-primary border-primary' : 'bg-secondary border-border'}`} />
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
    </label>
  )
}

function SaveToast({ visible }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-primary text-primary-foreground shadow-xl text-sm font-medium animate-bounce">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      Settings saved!
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const { dark, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  const [toastVisible, setToastVisible] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role:  user?.role  || '',
  })
  const [profileErrors, setProfileErrors] = useState({})

  // Password state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [pwErrors, setPwErrors]   = useState({})
  const [pwSuccess, setPwSuccess] = useState(false)

  // Notifications state
  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIF_OPTIONS.map(n => [n.key, true]))
  )

  // Appearance
  const [compactMode, setCompactMode] = useState(false)
  const [animEnabled, setAnimEnabled] = useState(true)

  const showToast = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  // ── Profile handlers ──
  const handleProfileChange = e => {
    const { name, value } = e.target
    setProfile(p => ({ ...p, [name]: value }))
    setProfileErrors(er => ({ ...er, [name]: undefined }))
  }

  const saveProfile = e => {
    e.preventDefault()
    const errors = {}
    if (!profile.name.trim()) errors.name = 'Name is required.'
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!profile.email.trim()) errors.email = 'Email is required.'
    else if (!emailRe.test(profile.email)) errors.email = 'Enter a valid email.'
    setProfileErrors(errors)
    if (Object.keys(errors).length > 0) return
    // 🔑 Update AuthContext so Header & Sidebar reflect the change instantly
    updateUser({ name: profile.name.trim(), email: profile.email.trim(), phone: profile.phone })
    showToast()
  }

  // ── Password handlers ──
  const handlePwChange = e => {
    const { name, value } = e.target
    setPasswords(p => ({ ...p, [name]: value }))
    setPwErrors(er => ({ ...er, [name]: undefined }))
    setPwSuccess(false)
  }

  const savePassword = e => {
    e.preventDefault()
    const errors = {}
    if (!passwords.current) errors.current = 'Enter your current password.'
    if (!passwords.next || passwords.next.length < 6) errors.next = 'New password must be at least 6 characters.'
    if (passwords.confirm !== passwords.next) errors.confirm = 'Passwords do not match.'
    setPwErrors(errors)
    if (Object.keys(errors).length > 0) return
    setPwSuccess(true)
    setPasswords({ current: '', next: '', confirm: '' })
  }

  // ── Logout ──
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = [
    { id: 'profile',       label: 'Profile',        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'appearance',    label: 'Appearance',      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'notifications', label: 'Notifications',   icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'security',      label: 'Security',        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'rbac',          label: 'Roles & Access',  icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'danger',        label: 'Danger Zone',     icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ]

  return (
    <section className="space-y-5">
      <GradientBanner title="Settings" subtitle="Manage your profile, preferences, security and access controls" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ── Sidebar Nav ── */}
        <Card className="p-4 h-fit">
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3 px-1">Settings</p>
          <nav className="space-y-1">
            {tabs.map(t => (
              <SectionTab key={t.id} {...t} active={activeTab === t.id} onClick={setActiveTab} />
            ))}
          </nav>
        </Card>

        {/* ── Content Panel ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* ─ Profile ─ */}
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-1">Profile Information</h3>
              <p className="text-sm text-muted-foreground mb-6">Update your display name and contact details.</p>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ background: 'linear-gradient(135deg,#714b67,#432c3d)' }}>
                  {(profile.name || user?.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profile.name || 'Your Name'}</p>
                  <p className="text-sm text-muted-foreground">{profile.role || 'No role assigned'}</p>
                  <p className="text-xs text-primary mt-0.5">{profile.email}</p>
                </div>
              </div>

              <form onSubmit={saveProfile} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Full Name</label>
                    <input name="name" value={profile.name} onChange={handleProfileChange} type="text" placeholder="Your full name"
                      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm placeholder:text-muted-foreground transition-all" />
                    {profileErrors.name && <p className="text-destructive text-xs mt-1">{profileErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Email Address</label>
                    <input name="email" value={profile.email} onChange={handleProfileChange} type="email" placeholder="you@transitops.in"
                      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm placeholder:text-muted-foreground transition-all" />
                    {profileErrors.email && <p className="text-destructive text-xs mt-1">{profileErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Phone (optional)</label>
                    <input name="phone" value={profile.phone} onChange={handleProfileChange} type="tel" placeholder="+91 98765 43210"
                      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm placeholder:text-muted-foreground transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Assigned Role</label>
                    <input value={profile.role || 'Not assigned'} readOnly
                      className="block w-full px-3 py-2.5 border border-border rounded-lg bg-secondary text-muted-foreground text-sm cursor-not-allowed" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity shadow">
                    Save Profile
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* ─ Appearance ─ */}
          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-1">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-6">Customize how TransitOps looks for you.</p>
              <div className="space-y-5">
                {/* Theme switcher */}
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Use the dark colour scheme across the dashboard.</p>
                  </div>
                  <Toggle checked={dark} onChange={toggleTheme} />
                </div>
                {/* Theme Preview */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">Theme Preview</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => dark && toggleTheme()}
                      className={`p-4 rounded-xl border-2 transition-all ${!dark ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                      <div className="h-16 rounded-lg bg-[#f5f2f6] mb-2 flex items-end p-2 gap-1">
                        <div className="w-6 h-8 bg-[#432c3d] rounded-sm" />
                        <div className="flex-1 h-6 bg-white rounded-sm border border-gray-100" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Light Mode</p>
                      {!dark && <p className="text-xs text-primary mt-0.5">✓ Active</p>}
                    </button>
                    <button onClick={() => !dark && toggleTheme()}
                      className={`p-4 rounded-xl border-2 transition-all ${dark ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                      <div className="h-16 rounded-lg bg-[#110d14] mb-2 flex items-end p-2 gap-1">
                        <div className="w-6 h-8 bg-[#432c3d] rounded-sm" />
                        <div className="flex-1 h-6 bg-[#1c1421] rounded-sm border border-gray-800" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Dark Mode</p>
                      {dark && <p className="text-xs text-primary mt-0.5">✓ Active</p>}
                    </button>
                  </div>
                </div>
                {/* Other prefs */}
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Compact Sidebar</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Collapse the sidebar to icon-only mode.</p>
                  </div>
                  <Toggle checked={compactMode} onChange={() => setCompactMode(v => !v)} />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable Animations</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Smooth transitions and hover effects.</p>
                  </div>
                  <Toggle checked={animEnabled} onChange={() => setAnimEnabled(v => !v)} />
                </div>
              </div>
            </Card>
          )}

          {/* ─ Notifications ─ */}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-1">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose which events should send you notifications.</p>
              <div className="space-y-1">
                {NOTIF_OPTIONS.map(n => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-border last:border-none">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={() => setNotifs(s => ({ ...s, [n.key]: !s[n.key] }))} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => { setNotifs(Object.fromEntries(NOTIF_OPTIONS.map(n => [n.key, true]))); showToast() }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  Enable All
                </button>
                <button onClick={() => setNotifs(Object.fromEntries(NOTIF_OPTIONS.map(n => [n.key, false])))}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">
                  Disable All
                </button>
              </div>
            </Card>
          )}

          {/* ─ Security ─ */}
          {activeTab === 'security' && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-1">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-6">Update your password to keep your account secure.</p>

              {pwSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm mb-5">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Password changed successfully!
                </div>
              )}

              <form onSubmit={savePassword} noValidate className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Current Password</label>
                  <input name="current" value={passwords.current} onChange={handlePwChange} type="password" placeholder="••••••••"
                    className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm tracking-widest placeholder:text-muted-foreground transition-all" />
                  {pwErrors.current && <p className="text-destructive text-xs mt-1">{pwErrors.current}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">New Password</label>
                  <input name="next" value={passwords.next} onChange={handlePwChange} type="password" placeholder="••••••••"
                    className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm tracking-widest placeholder:text-muted-foreground transition-all" />
                  {pwErrors.next && <p className="text-destructive text-xs mt-1">{pwErrors.next}</p>}
                  {passwords.next.length > 0 && (
                    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${passwords.next.length < 6 ? 'bg-red-500 w-1/4' : passwords.next.length < 10 ? 'bg-amber-400 w-2/4' : 'bg-green-500 w-full'}`} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1.5">Confirm New Password</label>
                  <input name="confirm" value={passwords.confirm} onChange={handlePwChange} type="password" placeholder="••••••••"
                    className="block w-full px-3 py-2.5 border border-border rounded-lg bg-input text-foreground text-sm tracking-widest placeholder:text-muted-foreground transition-all" />
                  {pwErrors.confirm && <p className="text-destructive text-xs mt-1">{pwErrors.confirm}</p>}
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity shadow">
                    Update Password
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Active Sessions</h4>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Current Browser Session</p>
                    <p className="text-xs text-muted-foreground">Windows • Chrome — Active now</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </Card>
          )}

          {/* ─ RBAC ─ */}
          {activeTab === 'rbac' && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Role-Based Access Control</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Each role has a defined set of permissions.</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: '#f3eaf1', color: '#714b67' }}>
                  RBAC Active
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES_CONFIG.map(r => (
                  <div key={r.name} className={`rounded-xl border p-5 transition-all hover:shadow-md ${profile.role === r.name ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm" style={{ background: r.color }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                          {r.name}
                          {profile.role === r.name && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">You</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.perms.length} permissions</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.perms.map(p => (
                        <span key={p} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: r.color + '18', color: r.color }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ─ Danger Zone ─ */}
          {activeTab === 'danger' && (
            <Card className="p-6 border-destructive/30">
              <h3 className="text-base font-semibold text-destructive mb-1">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-6">These actions are irreversible. Please proceed with caution.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-destructive/40 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Log out of all sessions</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sign out from all devices and browsers.</p>
                  </div>
                  <button onClick={handleLogout}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all">
                    Log Out
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data. Cannot be undone.</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>

      <SaveToast visible={toastVisible} />
    </section>
  )
}
