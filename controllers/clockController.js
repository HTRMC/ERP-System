// controllers/clockController.js
const db = require('../config/db');

exports.clockIn = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await db.query('INSERT INTO clock_entries (user_id, project_id, clock_in_time) VALUES (?, ?, NOW())', [user_id, project_id]);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.clockOut = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;
  try {
    await db.query('UPDATE clock_entries SET clock_out_time = NOW() WHERE user_id = ? AND project_id = ? AND clock_out_time IS NULL', [user_id, project_id]);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
