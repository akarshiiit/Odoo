export default function FuelExpenses() {
  return (
    <section>
      <h2>Fuel & Expense Management</h2>
      <div className="panel">
        <div className="controls">
          <button className="btn">+ Log Fuel</button>
          <button className="btn">+ Add Expense</button>
        </div>
        <div className="panel empty">Fuel logs and expenses (UI only)</div>
      </div>
    </section>
  )
}
