import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/layouts/AdminLayout"
import Login from "@/pages/auth/Login"
import { Register } from "@/pages/auth/Register"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'
import InquiryForm from "./pages/inquiry/InquiryForm"
import AddTable from "./pages/tables/AddTable"
import EditTable from "./pages/tables/EditTable"

// TODO: Replace with actual auth check
const isAuthenticated = true

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="dineflow-ui-theme">
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/inquiry" element={<InquiryForm />} />
            {/* Protected Admin Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div>Admin Dashboard</div>} />
              <Route path="tables" element={<div>Tables</div>} />
              <Route path="tables/add" element={<AddTable />} />
              <Route path="tables/edit/:id" element={<EditTable />} />
              <Route path="menu" element={<div>Menu</div>} />
              <Route path="dishes" element={<div>Dishes</div>} />
              <Route path="orders" element={<div>Orders</div>} />
              <Route path="reservations" element={<div>Reservations</div>} />
              <Route path="staff" element={<div>Staff</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="settings" element={<div>Settings</div>} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </Provider>
  )
}

export default App
