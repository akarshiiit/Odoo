import React, { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../components/ThemeContext";

const ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

const Login = () => {
  const { login, isAuthenticated, loading, error: authError } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "", role: "Dispatcher" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      // AuthContext handles error state
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || loading;

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-secondary flex-col justify-between p-12 transition-colors duration-200">
        <div>
          <div className="w-12 h-12 bg-amber-500 rounded-sm mb-6 flex items-center justify-center bg-opacity-70 border border-amber-600/30 shadow-sm" style={{backgroundImage: 'radial-gradient(#b45309 1px, transparent 1px)', backgroundSize: '4px 4px'}}>
          </div>
          <h1 className="text-4xl font-semibold text-secondary-foreground tracking-tight mb-2">TransitOps</h1>
          <p className="text-sm text-muted-foreground mb-16 font-medium tracking-wide">Smart Transport Operations Platform</p>
          
          <h2 className="text-lg font-semibold text-secondary-foreground mb-4 mt-8">One login, four roles:</h2>
          <ul className="space-y-4">
            {ROLES.map((r, i) => (
              <li key={i} className="flex items-center text-secondary-foreground text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-3"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
          TRANSITOPS © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-background flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto transition-colors duration-200">
        
        {/* Floating Theme Toggle */}
        <div className="absolute top-6 right-6">
          <button 
            onClick={toggle}
            className="p-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-200 border border-border shadow-sm"
            aria-label="Toggle Theme"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="w-full max-w-md my-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Sign in to your account</h2>
          <p className="text-muted-foreground text-sm mb-10">Enter your credentials to continue</p>
          
          {authError && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-4 rounded-xl mb-6 text-sm flex items-start gap-3 shadow-sm">
             <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             <div>
               <p className="font-semibold mb-1">Error state</p>
               <p>{authError}</p>
             </div>
          </div>}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5" htmlFor="email">EMAIL</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-ring placeholder-muted-foreground transition-colors text-sm shadow-inner"
                placeholder="you@transitops.in"
                autoComplete="email"
              />
              {formErrors.email && <span className="block text-destructive text-xs mt-1">{formErrors.email}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5" htmlFor="password">PASSWORD</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-ring placeholder-muted-foreground transition-colors text-sm tracking-widest shadow-inner"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {formErrors.password && <span className="block text-destructive text-xs mt-1">{formErrors.password}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5" htmlFor="role">ROLE (RBAC)</label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-ring appearance-none cursor-pointer transition-colors text-sm shadow-inner"
                >
                  <option value="" disabled>Select role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="sr-only" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'bg-input border-border group-hover:border-primary'}`}>
                    {rememberMe && <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                </div>
                <span className="ml-3 text-sm text-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:opacity-80 transition-opacity">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={isBusy}
              className="w-full py-3.5 rounded-lg text-primary-foreground font-medium transition-all shadow hover:opacity-90 mt-6 disabled:opacity-70 disabled:cursor-not-allowed bg-primary"
            >
              {isBusy ? "Signing in..." : "Sign In"}
            </button>
            
            <p className="text-sm text-center text-muted-foreground mt-6">
              Don't have an account? <Link to="/signup" className="text-primary hover:opacity-80 transition-opacity ml-1">Sign up</Link>
            </p>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
            <p className="mb-2 opacity-80">Access is scoped by role after login:</p>
            <ul className="space-y-1.5 opacity-70">
              <li>• Fleet Manager → Fleet, Maintenance</li>
              <li>• Dispatcher → Dashboard, Trips</li>
              <li>• Safety Officer → Drivers, Compliance</li>
              <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
