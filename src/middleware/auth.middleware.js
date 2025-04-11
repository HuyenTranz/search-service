const authService = require('../services/auth.service');

const authMiddleware = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided in header');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    // console.log('Validating token:', token);

    // Validate token and get user info
    const userInfo = await authService.validateToken(token);
    // console.log('Token validated, user info:', userInfo);

    if (!userInfo || !userInfo.userId) {
      console.log('Invalid user info from token');
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Set user information in request
    req.user = userInfo;
    // console.log('User set in request:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
}; 