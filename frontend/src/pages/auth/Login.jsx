import React, { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setSubmitting(true);

    await login({
      email: formData.email.trim(),
      password: formData.password,
    });

    const redirectTo = location.state?.from?.pathname || "/dashboard";
    navigate(redirectTo, { replace: true });

  } catch (err) {
   
  } finally {
    setSubmitting(false);
  }
};

  const isBusy = submitting || loading;

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit} noValidate>
        <h1 style={styles.title}>TransitOps Login</h1>
        <p style={styles.subtitle}>Sign in to access your dashboard.</p>

        {/* Server-side / auth error (e.g. invalid credentials) */}
        {authError && <div style={styles.errorBanner}>{authError}</div>}

        {/* Email field */}
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {formErrors.email && <span style={styles.fieldError}>{formErrors.email}</span>}

        {/* Password field */}
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {formErrors.password && <span style={styles.fieldError}>{formErrors.password}</span>}

        <button type="submit" style={styles.button} disabled={isBusy}>
          {isBusy ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "380px",
  },
  title: { margin: 0, fontSize: "1.5rem", color: "#1a202c" },
  subtitle: { marginTop: "0.25rem", marginBottom: "1.5rem", color: "#718096", fontSize: "0.9rem" },
  label: { display: "block", marginBottom: "0.35rem", fontSize: "0.85rem", color: "#2d3748", fontWeight: 600 },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    marginBottom: "0.25rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  fieldError: { display: "block", color: "#e53e3e", fontSize: "0.78rem", marginBottom: "0.75rem" },
  errorBanner: {
    background: "#fed7d7",
    color: "#822727",
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.7rem",
    marginTop: "0.75rem",
    background: "#2b6cb0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  footerText: { marginTop: "1.25rem", fontSize: "0.85rem", textAlign: "center", color: "#4a5568" },
};

export default Login;
