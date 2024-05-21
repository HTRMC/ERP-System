exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

exports.ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role_id === 3) { // 3 is the role ID for admin
    return next();
  }
  res.redirect('/dashboard');
};

exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role_id === 3 || req.user.role_id === 2)) { // 2 is the role ID for manager
    return next();
  }
  res.redirect('/dashboard');
};
