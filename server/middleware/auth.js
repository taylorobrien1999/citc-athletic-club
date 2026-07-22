const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ── Verify JWT AND re-check current role/active status from the database ──────
// Trusting only the JWT's embedded role would mean a demoted or deactivated
// account keeps its old permissions until the token naturally expires — this
// looks up the live record on every request so changes take effect immediately.
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Account not found.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'This account has been deactivated. Please contact CITC.' });
    }

    // Always use the CURRENT role/status from the database, never the token's
    // stale snapshot from whenever the person originally logged in.
    req.user = { id: user.id, email: user.email, role: user.role };
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
