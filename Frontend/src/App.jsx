import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";

import Dashboard from "./pages/User-Dashboard/Dashboard/Dashboard";
import Layout from "./pages/User-Dashboard/Layout/Layout";
import Analytics from "./pages/User-Dashboard/Analytics/Analytics";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Products from "./pages/User-Dashboard/Products/Products";
import Orders from "./pages/User-Dashboard/Orders/Orders";
import ManageUsers from "./pages/User-Dashboard/ManageUsers/ManageUsers";
import Categories from "./pages/User-Dashboard/Categories/Categories";

import "./App.css";
import NotFound from "./components/NotFound/NotFound";
import Alerts from "./pages/Alerts/Alerts";
import Settings from "./pages/Settings/Settings";

function AnimatedRoutes() {
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const validPaths = [
      "/login",
      "/register",
      "/dashboard",
      "/analytics",
      "/products",
      "/categories",
      "/orders",
      "/manage-users",
      "/alerts",
      "/settings",
      "/not-found",
    ];
    if (!validPaths.includes(location.pathname)) {
      window.location.href = "/not-found";
    }
  }, [location]);

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

        {role === "Admin" && (
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route
              path='dashboard'
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />
            <Route
              path='analytics'
              element={
                <PageWrapper>
                  <Analytics />
                </PageWrapper>
              }
            />
            <Route
              path='products'
              element={
                <PageWrapper>
                  <Products />
                </PageWrapper>
              }
            />
            <Route
              path='categories'
              element={
                <PageWrapper>
                  <Categories />
                </PageWrapper>
              }
            />
            <Route
              path='orders'
              element={
                <PageWrapper>
                  <Orders />
                </PageWrapper>
              }
            />
            <Route
              path='manage-users'
              element={
                <PageWrapper>
                  <ManageUsers />
                </PageWrapper>
              }
            />
            <Route
              path='alerts'
              element={
                <PageWrapper>
                  <Alerts />
                </PageWrapper>
              }
            />

            <Route
              path='settings'
              element={
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              }
            />
          </Route>
        )}

        {role === "Business Owner" && (
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route
              path='dashboard'
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />
            <Route
              path='products'
              element={
                <PageWrapper>
                  <Products />
                </PageWrapper>
              }
            />
            <Route
              path='categories'
              element={
                <PageWrapper>
                  <Categories />
                </PageWrapper>
              }
            />
            <Route
              path='orders'
              element={
                <PageWrapper>
                  <Orders />
                </PageWrapper>
              }
            />
            <Route
              path='analytics'
              element={
                <PageWrapper>
                  <Analytics />
                </PageWrapper>
              }
            />
            <Route
              path='alerts'
              element={
                <PageWrapper>
                  <Alerts />
                </PageWrapper>
              }
            />
            <Route
              path='settings'
              element={
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              }
            />
          </Route>
        )}

        {role === "Employee" && (
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route
              path='dashboard'
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />
            <Route
              path='products'
              element={
                <PageWrapper>
                  <Products />
                </PageWrapper>
              }
            />
            <Route
              path='categories'
              element={
                <PageWrapper>
                  <Categories />
                </PageWrapper>
              }
            />
            <Route
              path='orders'
              element={
                <PageWrapper>
                  <Orders />
                </PageWrapper>
              }
            />
            <Route
              path='settings'
              element={
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              }
            />
          </Route>
        )}
        {!role && <Route path='*' element={<Navigate to='/login' replace />} />}

        <Route path='/not-found' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/not-found' replace />} />
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
