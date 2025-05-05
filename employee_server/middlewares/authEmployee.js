import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate the employee using JWT from cookies.
 */

const authEmployee = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.employeeId = decoded.id;
    req.employee = {
      id: decoded.id,
      role: decoded.role || 'employee',
      email: decoded.email || null,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Your token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid token.',
    });
  }
};

export default authEmployee;
