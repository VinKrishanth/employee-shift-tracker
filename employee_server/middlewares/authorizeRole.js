/**
 * Middleware to check if the employee has the required role.
 * @param {string|string[]} role - The role(s) to check against (e.g., 'admin' or ['admin', 'employee']).
 */
const authorizeRole = (role) => {
    return (req, res, next) => {
      const roles = Array.isArray(role) ? role : [role];
  
      if (!roles.includes(req.employee?.role)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: You do not have permission to access this resource. Required role(s): ${roles.join(', ')}`,
        });
      }
  
      // Proceed to the next middleware or route handler
      next();
    };
  };
  
  export default authorizeRole;
  