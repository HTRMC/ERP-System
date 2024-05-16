// routes/reportRoutes.js
const express = require('express');
const reportController = require('../controllers/reportController');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/hours', ensureAuthenticated, reportController.getHoursReport);

module.exports = router;
