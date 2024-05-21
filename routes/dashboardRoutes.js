const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;
