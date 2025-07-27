import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import Login from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "./store";

import EditTable from "./pages/tables/EditTable";
import Tables from "./pages/tables/Tables";
import Inquiry from "./pages/inquiry/Inquiry";
import PrivateRoute from "./PrivateRoute";
import RoleGuard from "./RoleGuard";
import Restaurants from "./pages/restaurants/Restaurants";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="dineflow-ui-theme">
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Admin Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div>Dashboard</div>} />
              <Route
                path="restaurants"
                element={
                  <RoleGuard requiredRole={["ADMIN"]}>
                    <Restaurants />
                  </RoleGuard>
                }
              />
              <Route path="tables" element={<Tables />} />
              <Route path="tables/edit/:id" element={<EditTable />} />
              <Route path="menu" element={<div>Menu</div>} />
              <Route path="dishes" element={<div>Dishes</div>} />
              <Route path="orders" element={<div>Orders</div>} />
              <Route path="reservations" element={<div>Reservations</div>} />
              <Route path="staff" element={<div>Staff</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="settings" element={<div>Settings</div>} />
              <Route
                path="inquiries"
                element={
                  <RoleGuard requiredRole={["ADMIN"]}>
                    <Inquiry />
                  </RoleGuard>
                }
              />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
