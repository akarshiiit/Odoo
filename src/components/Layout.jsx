import { Outlet, NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    ['dashboard', 'Dashboard'],
    ['vehicles', 'Fleet'],
    ['drivers', 'Drivers'],
    ['trips', 'Trips'],
    ['maintenance', 'Maintenance'],
    ['fuel-expenses', 'Fuel & Expenses'],
    ['analytics', 'Analytics'],
    ['settings', 'Settings'],
  ]

  return (
    <aside className="sidebar">
      <div className="brand">TransitOps</div>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={`/${to}`} className={({ isActive }) => isActive ? 'nav active' : 'nav'}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

function Header() {
  return (
    <header className="app-header">
      <div className="search">
        <input placeholder="Search..." />
      </div>
      <div className="user">Raven K. <span className="role">Dispatcher</span></div>
    </header>
  )
}

export default function Layout() {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="main">
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
