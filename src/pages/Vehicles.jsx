export default function Vehicles() {
  return (
    <section>
      <h2>Vehicle Registry</h2>
      <div className="panel">
        <div className="controls">
          <input placeholder="Search reg. no..." />
          <button className="btn">+ Add Vehicle</button>
        </div>
        <table className="table empty">
          <thead>
            <tr><th>Reg. No</th><th>Name/Model</th><th>Type</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan={4} className="muted">No data (UI only)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
