const db = require('../config/db');
const ClockEntry = require('../models/ClockEntry');
const User = require('../models/User');

exports.clockIn = async (req, res) => {
  try {
    const { project_id } = req.body;
    await ClockEntry.create({
      user_id: req.user.id,
      project_id,
      clock_in_time: new Date(),
    });

    await User.updateStatus(req.user.id, 'clocked-in');

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error clocking in:', err);
    res.status(500).send('Server error');
  }
};

exports.clockOut = async (req, res) => {
  try {
    const { project_id } = req.body;
    const lastClockEntry = await ClockEntry.getLastClockEntry(req.user.id);

    if (lastClockEntry && !lastClockEntry.clock_out_time) {
      await ClockEntry.updateClockOutTime(lastClockEntry.id, new Date());

      await User.updateStatus(req.user.id, 'clocked-out');
    }

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error clocking out:', err.message); // Enhanced error logging
    res.status(500).send('Server error');
  }
};
