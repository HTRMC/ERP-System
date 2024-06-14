// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, ensureAdmin, (req, res) => {
    const userId = req.query.userId;
    userController.getUsers(req, res, userId);
  });
router.get('/:id', ensureAuthenticated, ensureAdmin, userController.getUserById);
router.post('/:id/permissions', ensureAuthenticated, ensureAdmin, userController.updateUserPermissions);
router.post('/register', ensureAuthenticated, ensureAdmin, userController.registerUser);

module.exports = router;