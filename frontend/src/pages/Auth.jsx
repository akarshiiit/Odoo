import { Link } from 'react-router-dom'

export default function Auth() {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>TransitOps</h1>
        <p>Smart Transport Operations Platform</p>
        <ul>
          <li>Fleet Manager</li>
          <li>Dispatcher</li>
          <li>Safety Officer</li>
          <li>Financial Analyst</li>
        </ul>
      </div>
      <div className="auth-right">
        <h2>Sign in to your account</h2>
        <div className="form">
          <label>Email</label>
          <input />
          <label>Password</label>
          <input type="password" />
          <label>Role</label>
          <select>
            <option>Dispatcher</option>
            <option>Fleet Manager</option>
          </select>
          <div className="actions">
            <Link to="/dashboard" className="btn primary">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
