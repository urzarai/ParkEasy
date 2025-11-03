import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BuildingManagement from "./pages/BuildingManagement.jsx";
import SpotManagement from "./pages/SpotManagement.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/buildings"
            element={
              <PrivateRoute roles={["admin"]}>
                <BuildingManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/spots"
            element={
              <PrivateRoute roles={["admin"]}>
                <SpotManagement />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
