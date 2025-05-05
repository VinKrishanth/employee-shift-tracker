import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for the given employee.
 * @param {Object} employee - The employee object containing the employee's data.
 * @returns {string} - The signed JWT token.
 */
const generateToken = (employee) => {
  return jwt.sign(
    {
      id: employee._id,        
      role: employee.role,    
      email: employee.email,   
    },
    process.env.JWT_SECRET,  
    {
      expiresIn: '9h',      
    }
  );
};

export default generateToken;
