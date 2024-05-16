// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, ensureAdmin, userController.getUsers);
router.get('/:id', ensureAuthenticated, ensureAdmin, userController.getUserById);
router.post('/:id/permissions', ensureAuthenticated, ensureAdmin, userController.updateUserPermissions);

module.exports = router;
