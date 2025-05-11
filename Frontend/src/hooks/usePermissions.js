import { useMemo } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

export const usePermissions = () => {
    const userRole = sessionStorage.getItem('role');

    const permissions = useMemo(() => ({
        can: (permission) => hasPermission(userRole, permission),
        canAny: (permissions) => hasAnyPermission(userRole, permissions),
        canAll: (permissions) => hasAllPermissions(userRole, permissions)
    }), [userRole]);

    return permissions;
};
