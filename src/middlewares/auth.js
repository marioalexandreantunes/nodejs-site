function authMiddleware(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Please login to access this page');
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = authMiddleware;
