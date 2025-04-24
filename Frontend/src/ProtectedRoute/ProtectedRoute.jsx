import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToken } from "../hooks/TokenContext";
const ProtectedRoute = ({ children }) => {
  const { token } = useToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
