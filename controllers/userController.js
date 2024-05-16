// controllers/userController.js
const db = require('../config/db');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('user', { user });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Permission denied');
    }
    await User.updateRole(id, role);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
