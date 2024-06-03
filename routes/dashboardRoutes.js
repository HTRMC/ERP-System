const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const Project = require('../models/Project');
const ClockEntry = require('../models/ClockEntry');

const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await Project.findAll();
    const lastClockEntry = await ClockEntry.getLastClockEntry(req.user.id);
    const isClockedIn = lastClockEntry && !lastClockEntry.clock_out_time;

    const hoursByProject = await ClockEntry.getTotalHoursByProject(req.user.id);

    res.render('dashboard', { 
      user: req.user, 
      projects, 
      isClockedIn, 
      lastClockEntry,
      hoursByProject
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
