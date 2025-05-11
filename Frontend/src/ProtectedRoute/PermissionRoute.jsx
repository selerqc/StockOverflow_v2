import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';

const PermissionRoute = ({ requiredPermission, children }) => {
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');

    if (!hasPermission(userRole, requiredPermission)) {
        return <Navigate to="/forbidden" replace state={{ from: location }} />;
    }

    return children;
};

export default PermissionRoute;
