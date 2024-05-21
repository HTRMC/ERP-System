// routes/clockRoutes.js
const express = require('express');
const clockController = require('../controllers/clockController');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, clockController.renderClockPage); 
router.post('/clock-in', ensureAuthenticated, clockController.clockIn);
router.post('/clock-out', ensureAuthenticated, clockController.clockOut);

module.exports = router;
