import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Maintenance from './pages/Maintenance'
import FuelExpenses from './pages/FuelExpenses'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import './styles/ui.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="trips" element={<Trips />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="fuel-expenses" element={<FuelExpenses />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
