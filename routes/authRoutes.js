// routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const { showForgotPasswordForm, handleForgotPassword, showResetPasswordForm, handleResetPassword } = require('../controllers/authController');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth/login?error=' + encodeURIComponent(info.message));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

// New routes for password reset
router.get('/forgot-password', showForgotPasswordForm);
router.post('/forgot-password', handleForgotPassword);
router.get('/reset-password/:token', showResetPasswordForm);
router.post('/reset-password/:token', handleResetPassword);

module.exports = router;
