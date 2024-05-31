// controllers/authController.js

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role_id: 1 });
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }
    res.redirect('/');
  });
};

exports.showForgotPasswordForm = (req, res) => {
  res.render('forgot-password');
};

exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).send('No account with that email found.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour
    await User.setResetToken(email, token, expires);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/auth/reset-password/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).send('Server error');
  }
};

exports.showResetPasswordForm = (req, res) => {
  res.render('reset-password', { token: req.params.token });
};

exports.handleResetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findByResetToken(req.params.token);
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).send('Server error');
  }
};
