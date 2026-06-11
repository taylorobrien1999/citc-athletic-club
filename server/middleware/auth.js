const jwt = require('jsonwebtoken');

// ── Verify JWT ───────────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// ── Role-based access control ────────────────────────────────────────────────
// Roles: 'member', 'admin'
// Visitors are unauthenticated — they never reach protected routes.
//
// Usage examples:
//   router.get('/dashboard', authenticate, authorize('member', 'admin'), handler)
//   router.post('/announcements', authenticate, authorize('admin'), handler)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
