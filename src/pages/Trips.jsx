export default function Trips() {
  return (
    <section>
      <h2>Trip Dispatcher</h2>
      <div className="panel two-column">
        <div className="col">
          <h4>Create Trip</h4>
          <div className="form-ghost">
            <input placeholder="Source" />
            <input placeholder="Destination" />
            <input placeholder="Cargo weight (kg)" />
            <div className="muted">Vehicle Capacity checks are UI-only</div>
            <button className="btn">Dispatch (disabled)</button>
          </div>
        </div>
        <div className="col">
          <h4>Live Board</h4>
          <div className="panel empty">No trips to show (UI only)</div>
        </div>
      </div>
    </section>
  )
}
