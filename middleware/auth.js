// middleware/auth.js
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

exports.ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.redirect('/dashboard');
};

exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next();
  }
  res.redirect('/dashboard');
};
