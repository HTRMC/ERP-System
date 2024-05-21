// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { users, user: req.user });
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
