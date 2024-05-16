// routes/projectRoutes.js
const express = require('express');
const projectController = require('../controllers/projectController');
const { ensureAuthenticated, ensureManager } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, projectController.getProjects);
router.post('/', ensureAuthenticated, ensureManager, projectController.createProject);
router.get('/:id', ensureAuthenticated, projectController.getProjectById);

module.exports = router;
