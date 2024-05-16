// controllers/reportController.js
const db = require('../config/db');

exports.getHoursReport = async (req, res) => {
  const { period } = req.query; // daily, weekly, monthly
  const user_id = req.user.id;
  try {
    let query = '';
    if (period === 'daily') {
      query = 'SELECT project_id, DATE(clock_in_time) as date, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, DATE(clock_in_time)';
    } else if (period === 'weekly') {
      query = 'SELECT project_id, YEARWEEK(clock_in_time) as week, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, YEARWEEK(clock_in_time)';
    } else if (period === 'monthly') {
      query = 'SELECT project_id, MONTH(clock_in_time) as month, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, MONTH(clock_in_time)';
    }
    const [report] = await db.query(query, [user_id]);
    res.render('reports', { report, period });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
