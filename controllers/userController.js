// controllers/userController.js \\
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { users, user: req.user, error: null });
  } catch (err) {
    console.error('Error fetching users:', err);
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
    console.error('Error fetching user by ID:', err);
    res.status(500).send('Server error');
  }
};

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).send('User not found');
    }

    // Check if the current user is trying to change the role of another admin
    if (req.user.role_id === 3 && userToUpdate.role_id === 3 && id !== req.user.id) {
      return res.status(403).send('Permission denied: Admins cannot change the role of other admins.');
    }

    await User.updateRole(id, role_id);
    res.redirect('/users');
  } catch (err) {
    console.error('Error updating user permissions:', err);
    res.status(500).send('Server error');
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role_id });
    res.redirect('/users');
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      const users = await User.findAll();
      res.render('users', { users, user: req.user, error: 'User already exists' });
    } else {
      console.error('Error during user registration:', err);
      const users = await User.findAll();
      res.render('users', { users, user: req.user, error: 'Server error during registration' });
    }
  }
};