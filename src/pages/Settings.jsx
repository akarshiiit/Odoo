export default function Settings() {
  return (
    <section>
      <h2>Settings & RBAC</h2>
      <div className="panel">
        <div className="form-ghost">
          <input placeholder="Depot name" />
          <input placeholder="Currency" />
          <button className="btn primary">Save changes</button>
        </div>
        <div className="panel empty">Role-based access table (UI only)</div>
      </div>
    </section>
  )
}
