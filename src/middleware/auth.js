/**
 * Middleware to require authentication for protected routes
 * Redirects to login page if user is not authenticated
 */
const requireLogin = (req, res, next) => {
  // Check if user is logged in via session
  if (req.session && req.session.user) {
    // User is authenticated - continue
    res.locals.isLoggedIn = true;
    res.locals.userRole = req.session.user.role;
    next();
  } else {
    // User is not authenticated - redirect to login
    res.redirect('/login');
  }
};

/**
 * Middleware to require specific roles
 * @param {Array<string>} allowedRoles - Array of roles that are allowed (e.g., ['admin', 'sales_rep'])
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // First check if user is logged in
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }

    // Check if user's role is in allowed roles
    if (allowedRoles.includes(req.session.user.role)) {
      res.locals.isLoggedIn = true;
      res.locals.userRole = req.session.user.role;
      next();
    } else {
      // User is logged in but doesn't have permission
      res.status(403).render('pages/error', {
        message: 'Access Denied',
        error: { message: 'You do not have permission to access this page.' }
      });
    }
  };
};

export { requireLogin, requireRole };
