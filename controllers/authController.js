// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role_id: 1 });
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error during user registration:', err); // Log the error
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err); // Log the error
      return next(err);
    }
    res.redirect('/');
  });
};
