// controllers/clockController.js
const db = require('../config/db');
const Project = require('../models/Project');
const ClockEntry = require('../models/ClockEntry');

exports.renderClockPage = async (req, res) => {
  try {
    const projects = await Project.findAll();
    const lastClockEntry = await ClockEntry.getLastClockEntry(req.user.id);

    const isClockedIn = lastClockEntry && !lastClockEntry.clock_out_time;

    res.render('clock', { projects, user: req.user, isClockedIn, lastClockEntry });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.clockIn = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await ClockEntry.clockIn(user_id, project_id);
    res.redirect('/clock');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.clockOut = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await ClockEntry.clockOut(user_id, project_id);
    res.redirect('/clock');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
