const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      accountId: decodedToken.accountId
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Unauthorized',
        code: 'AUTH_ERROR'
      }
    });
  }
};