// controllers/reportController.js
const ClockEntry = require('../models/ClockEntry');
const moment = require('moment');

exports.getHoursReport = async (req, res) => {
  const period = req.query.period || 'daily'; // Set default period to 'daily'
  const user_id = req.user.id;

  //console.log(`Period: ${period}`); // Log the period for debugging
  //console.log(`Query parameters: ${JSON.stringify(req.query)}`); // Log all query parameters for debugging

  try {
    const report = await ClockEntry.getHoursReport(user_id, period);
    // Format dates
    report.forEach(entry => {
      if (period === 'daily') {
        entry.date = moment(entry.date).format('DD/MM/YYYY HH:mm:ss');
      } else if (period === 'weekly') {
        entry.week = `Week ${entry.week}`;
      } else if (period === 'monthly') {
        entry.month = `Month ${entry.month}`;
      }
      entry.hours_worked = (entry.seconds_worked / 3600).toFixed(2);
    });

    res.render('reports', { report, period, user: req.user });
  } catch (err) {
    console.error('Error fetching hours report:', err.message);
    res.status(500).send('Server error');
  }
};