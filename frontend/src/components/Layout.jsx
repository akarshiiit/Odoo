import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from './ThemeContext'

const navLinks = [
  {
    to: 'dashboard', label: 'Dashboard',
    path: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z'
  },
  {
    to: 'vehicles', label: 'Fleet',
    path: 'M5 16V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12m-6-10h.01M9 16v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5h7z'
  },
  {
    to: 'drivers', label: 'Drivers',
    path: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z'
  },
  {
    to: 'trips', label: 'Trips',
    path: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
  },
  {
    to: 'maintenance', label: 'Maintenance',
    path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  },
  {
    to: 'fuel-expenses', label: 'Fuel & Expenses',
    path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    to: 'analytics', label: 'Analytics',
    path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    to: 'settings', label: 'Settings',
    path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  },
]

function Sidebar() {
  const { dark, toggle } = useTheme()
  const { user } = useAuth()
  const initial = (user?.name || 'U')[0].toUpperCase()
  return (
    <aside className="w-64 h-screen flex flex-col sticky top-0 hidden md:flex shadow-xl" style={{ background: '#432c3d' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="text-xl font-bold text-white tracking-wide">TransitOps</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navLinks.map(({ to, label, path }) => (
          <NavLink
            key={to}
            to={`/${to}`}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#714b67] text-white shadow-sm'
                  : 'text-white/65 hover:bg-[#714b67] hover:text-white'
              }`
            }
          >
            <svg className="w-4.5 h-4.5 mr-3 flex-shrink-0 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
            </svg>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{initial}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-white/55 truncate">{user?.role || 'No role'}</p>
          </div>
        </div>
        <button 
          onClick={toggle}
          className="p-1.5 rounded-lg text-white/65 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
          aria-label="Toggle Theme"
        >
          {dark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  )
}

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const initial = (user?.name || 'U')[0].toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center w-full max-w-sm">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-transparent text-foreground placeholder-muted-foreground transition-all focus:bg-background"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer transition-transform hover:scale-105" 
            style={{ background: 'linear-gradient(135deg, #714b67, #432c3d)' }}
          >
            {initial}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
