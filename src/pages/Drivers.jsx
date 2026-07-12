export default function Drivers() {
  return (
    <section>
      <h2>Drivers & Safety Profiles</h2>
      <div className="panel">
        <div className="controls">
          <button className="btn">+ Add Driver</button>
        </div>
        <table className="table empty">
          <thead>
            <tr><th>Driver</th><th>License No.</th><th>Category</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan={4} className="muted">No data (UI only)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
