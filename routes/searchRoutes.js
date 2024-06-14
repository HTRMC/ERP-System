// routes/searchRoutes.js
const express = require('express');
const searchController = require('../controllers/searchController');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, searchController.search);

module.exports = router;
