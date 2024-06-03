// controllers/clockController.js
const db = require('../config/db');
const Project = require('../models/Project');
const ClockEntry = require('../models/ClockEntry');

exports.clockIn = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await ClockEntry.clockIn(user_id, project_id);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.clockOut = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await ClockEntry.clockOut(user_id, project_id);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
