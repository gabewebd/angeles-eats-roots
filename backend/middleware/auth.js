const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Protects POST, PATCH, DELETE operations on secured routes.
 * Expects header: Authorization: Bearer <token>
 */
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role === 'admin') {
            req.admin = decoded;
        } else if (decoded.role === 'user') {
            req.user = decoded;
        } else {
            // Fallback for older tokens or if role is missing
            req.admin = decoded; 
        }
        
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};
