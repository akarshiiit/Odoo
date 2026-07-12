export default function Maintenance() {
  return (
    <section>
      <h2>Maintenance</h2>
      <div className="panel">
        <div className="form-ghost">
          <input placeholder="Vehicle" />
          <input placeholder="Service type" />
          <input placeholder="Cost" />
          <button className="btn primary">Save</button>
        </div>
        <div className="panel empty">Service log (UI only)</div>
      </div>
    </section>
  )
}
