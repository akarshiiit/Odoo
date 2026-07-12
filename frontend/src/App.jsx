import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
/* ------------------------------------------------------------------ */
/*  Temporary placeholder pages                                       */
/*  Replace these with real page components as they get built out.    */
/* ------------------------------------------------------------------ */

const PagePlaceholder = ({ title }) => (
  <div style={{ padding: "2rem" }}>
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

const Dashboard = () => <PagePlaceholder title="Dashboard" />;
const Vehicles = () => <PagePlaceholder title="Vehicles" />;
const Drivers = () => <PagePlaceholder title="Drivers" />;
const Trips = () => <PagePlaceholder title="Trips" />;
const Maintenance = () => <PagePlaceholder title="Maintenance" />;
const Reports = () => <PagePlaceholder title="Reports" />;


const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles"
        element={
          <ProtectedRoute allowedRoles={["Fleet Manager"]}>
            <Vehicles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drivers"
        element={
          <ProtectedRoute allowedRoles={["Safety Officer"]}>
            <Drivers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trips"
        element={
          <ProtectedRoute allowedRoles={["Driver"]}>
            <Trips />
          </ProtectedRoute>
        }
      />

      <Route
        path="/maintenance"
        element={
          <ProtectedRoute allowedRoles={["Fleet Manager"]}>
            <Maintenance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["Fleet Manager", "Financial Analyst"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes -> redirect to "/" (which itself resolves by auth state) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
