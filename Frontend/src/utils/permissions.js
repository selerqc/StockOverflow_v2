// Import roles and permissions from backend
export const ROLES = {
    ADMIN: 'Admin',
    BUSINESS_OWNER: 'Business Owner',
    EMPLOYEE: 'Employee'
};

export const PERMISSIONS = {
    CREATE_USER: 'create_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    VIEW_USERS: 'view_users',
    VIEW_EMPLOYEES: 'view_employees',
    MANAGE_PRODUCTS: 'manage_products',
    VIEW_PRODUCTS: 'view_products',
    MANAGE_CATEGORIES: 'manage_categories',
    VIEW_CATEGORIES: 'view_categories',
    MANAGE_ORDERS: 'manage_orders',
    VIEW_ORDERS: 'view_orders',
    VIEW_ANALYTICS: 'view_analytics',
    MANAGE_SETTINGS: 'manage_settings',
    MANAGE_TRANSACTIONS: 'manage_transactions',
    VIEW_TRANSACTIONS: 'view_transactions',
    MANAGE_ALERTS: 'manage_alerts',
    VIEW_ALERTS: 'view_alerts'
};

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.UPDATE_USER,
        PERMISSIONS.DELETE_USER,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.MANAGE_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.MANAGE_CATEGORIES,
        PERMISSIONS.VIEW_CATEGORIES,
        PERMISSIONS.MANAGE_ORDERS,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_SETTINGS,
        PERMISSIONS.MANAGE_TRANSACTIONS,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.MANAGE_ALERTS,
        PERMISSIONS.VIEW_ALERTS
    ],
    [ROLES.BUSINESS_OWNER]: [
        PERMISSIONS.MANAGE_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.MANAGE_CATEGORIES,
        PERMISSIONS.VIEW_CATEGORIES,
        PERMISSIONS.MANAGE_ORDERS,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_SETTINGS,
        PERMISSIONS.MANAGE_TRANSACTIONS,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.MANAGE_ALERTS,
        PERMISSIONS.VIEW_ALERTS,
        PERMISSIONS.VIEW_EMPLOYEES
    ],
    [ROLES.EMPLOYEE]: [
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.VIEW_CATEGORIES,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.VIEW_TRANSACTIONS,
        PERMISSIONS.VIEW_ALERTS,
        PERMISSIONS.MANAGE_SETTINGS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_ALERTS,
        PERMISSIONS.MANAGE_TRANSACTIONS,

    ]
};

export const hasPermission = (userRole, permission) => {
    if (!userRole || !permission) return false;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions) => {
    return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
    return permissions.every(permission => hasPermission(userRole, permission));
};
