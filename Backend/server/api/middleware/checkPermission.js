const { ROLE_PERMISSIONS } = require("../../config/roles");

const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;
            const permissions = ROLE_PERMISSIONS[userRole] || [];

            if (!permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You do not have permission to perform this action'
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error checking permissions',
                error: error.message
            });
        }
    };
};

module.exports = checkPermission;
