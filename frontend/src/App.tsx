import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Login } from "@/pages/auth/Login"
import { Register } from "@/pages/auth/Register"

// TODO: Replace with actual auth check
const isAuthenticated = true

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<div>Admin Dashboard</div>} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
