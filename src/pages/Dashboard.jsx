export default function Dashboard() {
  return (
    <section>
      <h2>Dashboard</h2>
      <div className="widgets">
        <div className="card">Active Vehicles</div>
        <div className="card">Available Vehicles</div>
        <div className="card">Vehicles in Maintenance</div>
        <div className="card">Active Trips</div>
      </div>

      <div className="panel">
        <h3>Recent Trips</h3>
        <table className="table empty">
          <thead>
            <tr><th>Trip</th><th>Vehicle</th><th>Driver</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan={4} className="muted">No data (UI only)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
