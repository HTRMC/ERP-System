// routes/reportRoutes.js
const express = require('express');
const reportController = require('../controllers/reportController');
const { ensureAuthenticated, ensureManagerOrAdmin } = require('../controllers/reportController');

const router = express.Router();

router.get('/hours', ensureAuthenticated, ensureManagerOrAdmin, reportController.getHoursReport);

module.exports = router;
