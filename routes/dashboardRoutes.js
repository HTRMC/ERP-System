// routes/dashboardRoutes.js
const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');
const ClockEntry = require('../models/ClockEntry');

const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await Project.findAll();
    const users = await User.findAll(); // Fetch all users
    const companiesWithProjectCount = await Project.getCompaniesWithProjectCount();
    const lastClockEntry = await ClockEntry.getLastClockEntry(req.user.id);
    const isClockedIn = lastClockEntry && !lastClockEntry.clock_out_time;
    const hoursByProject = await ClockEntry.getTotalHoursByProject(req.user.id);
    const totalHoursCurrentYear = await ClockEntry.getTotalHoursCurrentYear(req.user.id);

    res.render('dashboard', { 
      user: req.user, 
      users, 
      projects, 
      isClockedIn, 
      lastClockEntry,
      hoursByProject,
      totalHoursCurrentYear,
      companiesWithProjectCount
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
