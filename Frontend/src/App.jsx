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
import ForbiddenPage from "./components/NotFound/ForbiddenPage";
import Alerts from "./pages/Alerts/Alerts";
import Settings from "./pages/Settings/Settings";
const roleBasedRoutes = {
  Admin: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "analytics", element: <Analytics /> },
    { path: "products", element: <Products /> },
    { path: "categories", element: <Categories /> },
    { path: "orders", element: <Orders /> },
    { path: "manage-users", element: <ManageUsers /> },
    { path: "alerts", element: <Alerts /> },
    { path: "settings", element: <Settings /> },
  ],
  "Business Owner": [
    { path: "products", element: <Products /> },
    { path: "categories", element: <Categories /> },
    { path: "orders", element: <Orders /> },
    { path: "analytics", element: <Analytics /> },
    { path: "alerts", element: <Alerts /> },
    { path: "settings", element: <Settings /> },
  ],
  Employee: [
    { path: "products", element: <Products /> },
    { path: "categories", element: <Categories /> },
    { path: "orders", element: <Orders /> },
    { path: "settings", element: <Settings /> },
  ],
};

function AnimatedRoutes() {
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  if (
    !role &&
    location.pathname !== "/login" &&
    location.pathname !== "/register"
  ) {
    return <Navigate to='/login' replace />;
  }

  const renderRoutes = (routes) =>
    routes.map(({ path, element }) => (
      <Route
        key={path}
        path={path}
        element={<PageWrapper>{element}</PageWrapper>}
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
        <Route path='/not-found' element={<NotFound />} />
        <Route path='/forbidden' element={<ForbiddenPage />} />
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
