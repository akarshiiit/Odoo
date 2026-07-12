

import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const ROLES = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];

const Signup = () => {
  const { signup, isAuthenticated, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", 
  });
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

    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.role) {
      errors.role = "Please select a role.";
    } else if (!ROLES.includes(formData.role)) {
      errors.role = "Invalid role selected.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setSubmitting(true);

    await signup({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });

    navigate("/dashboard", { replace: true });

  } catch (error) {
    // Error is already handled in AuthContext
    console.error(error);
  } finally {
    setSubmitting(false);
  }
};

  const isBusy = submitting || loading;

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit} noValidate>
        <h1 style={styles.title}>Create your TransitOps account</h1>
        <p style={styles.subtitle}>Sign up and select your operational role.</p>

        {authError && <div style={styles.errorBanner}>{authError}</div>}

        {/* Name */}
        <label style={styles.label} htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          placeholder="Jane Doe"
          autoComplete="name"
        />
        {formErrors.name && <span style={styles.fieldError}>{formErrors.name}</span>}

        {/* Email */}
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

        {/* Password */}
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        {formErrors.password && <span style={styles.fieldError}>{formErrors.password}</span>}

        {/* Confirm Password */}
        <label style={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
        {formErrors.confirmPassword && (
          <span style={styles.fieldError}>{formErrors.confirmPassword}</span>
        )}

        {/* Role dropdown */}
        <label style={styles.label} htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="" disabled>
            Select your role
          </option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {formErrors.role && <span style={styles.fieldError}>{formErrors.role}</span>}

        <button type="submit" style={styles.button} disabled={isBusy}>
          {isBusy ? "Creating account..." : "Sign Up"}
        </button>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login">Sign in</Link>
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
    padding: "2rem 1rem",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
  },
  title: { margin: 0, fontSize: "1.4rem", color: "#1a202c" },
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
    background: "#fff",
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

export default Signup;
