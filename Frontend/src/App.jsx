import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "@ant-design/v5-patch-for-react-19";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";

import Dashboard from "./pages/User-Dashboard/Admin-Dashboard/Dashboard";
import Layout from "./pages/User-Dashboard/Layout/Layout";
import Analytics from "./pages/User-Dashboard/Analytics/Analytics";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Products from "./pages/User-Dashboard/Products/Products";
import Orders from "./pages/User-Dashboard/Orders/Orders";
import ManageUsers from "./pages/User-Dashboard/ManageUsers/ManageUsers";
import Categories from "./pages/User-Dashboard/Categories/Categories";

import "./App.css";
import NotFound from "./components/NotFound/NotFound";
import ForbiddenPage from "./components/NotFound/ForbiddenPage";
import Alerts from "./pages/Alerts/Alerts";
import Settings from "./pages/Settings/Settings";
import EmployeeDashboard from "./pages/User-Dashboard/Employee-Dashboard/EmployeeDashboard";
import BusinessOwnerDashboard from "./pages/User-Dashboard/BusinessOwner-Dashboard/BusinessOwner-Dashboard";
import ManageEmployees from "./pages/User-Dashboard/ManageEmployees/ManageEmployees";
import { PERMISSIONS } from './utils/permissions';
import PermissionRoute from './ProtectedRoute/PermissionRoute';

const roleBasedRoutes = {
  Admin: [
    { path: "admin-dashboard", element: <Dashboard />, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: "analytics", element: <Analytics />, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: "products", element: <Products />, permission: PERMISSIONS.VIEW_PRODUCTS },
    { path: "categories", element: <Categories />, permission: PERMISSIONS.VIEW_CATEGORIES },
    { path: "orders", element: <Orders />, permission: PERMISSIONS.VIEW_ORDERS },
    { path: "manage-users", element: <ManageUsers />, permission: PERMISSIONS.VIEW_USERS },
    { path: "alerts", element: <Alerts />, permission: PERMISSIONS.VIEW_ALERTS },
    { path: "settings", element: <Settings />, permission: PERMISSIONS.MANAGE_SETTINGS },
  ],
  "Business Owner": [
    { path: "businessowner-dashboard", element: <BusinessOwnerDashboard />, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: "products", element: <Products />, permission: PERMISSIONS.VIEW_PRODUCTS },
    { path: "categories", element: <Categories />, permission: PERMISSIONS.VIEW_CATEGORIES },
    { path: "orders", element: <Orders />, permission: PERMISSIONS.VIEW_ORDERS },
    { path: "analytics", element: <Analytics />, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: "manage-employees", element: <ManageEmployees />, permission: PERMISSIONS.VIEW_EMPLOYEES },
    { path: "settings", element: <Settings />, permission: PERMISSIONS.MANAGE_SETTINGS },
    { path: "alerts", element: <Alerts />, permission: PERMISSIONS.VIEW_ALERTS },
  ],
  Employee: [
    { path: "employee-dashboard", element: <EmployeeDashboard />, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: "products", element: <Products />, permission: PERMISSIONS.VIEW_PRODUCTS },
    { path: "categories", element: <Categories />, permission: PERMISSIONS.VIEW_CATEGORIES },
    { path: "alerts", element: <Alerts />, permission: PERMISSIONS.VIEW_ALERTS },
    { path: "settings", element: <Settings />, permission: PERMISSIONS.MANAGE_SETTINGS },
    { path: "orders", element: <Orders />, permission: PERMISSIONS.VIEW_ORDERS },
  ],
};

function AnimatedRoutes() {
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  // if (
  //   !role &&
  //   location.pathname !== "/login" &&
  //   location.pathname !== "/register"
  // ) {
  //   return <Navigate to='/login' replace />;
  // }
  const renderRoutes = (routes) =>
    routes.map(({ path, element, permission }) => (
      <Route
        key={path}
        path={path}
        element={
          <PageWrapper>
            <PermissionRoute requiredPermission={permission}>
              {element}
            </PermissionRoute>
          </PageWrapper>
        }
      />
    ));

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path='/login'
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path='/register'
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        {role && (
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            {renderRoutes(roleBasedRoutes[role] || [])}
          </Route>
        )}
        <Route
          path='*'
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
        {!role && (
          <Route
            path='*'
            element={
              <PageWrapper>
                <ForbiddenPage />
              </PageWrapper>
            }
          />
        )}
        <Route path='/' element={<Navigate to='/login' replace />} />

      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
