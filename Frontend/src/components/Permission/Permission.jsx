import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export const Permission = ({
    permission,
    permissions,
    requireAll = false,
    children,
    fallback = null
}) => {
    const { can, canAny, canAll } = usePermissions();

    const hasAccess = () => {
        if (permission) {
            return can(permission);
        }
        if (permissions) {
            return requireAll ? canAll(permissions) : canAny(permissions);
        }
        return false;
    };

    return hasAccess() ? children : fallback;
};

export default Permission;
