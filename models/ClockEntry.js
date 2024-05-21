// models/ClockEntry.js
const db = require('../config/db');

class ClockEntry {
  static async clockIn(userId, projectId) {
    await db.query('INSERT INTO clock_entries (user_id, project_id, clock_in_time) VALUES (?, ?, NOW())', [userId, projectId]);
  }

  static async clockOut(userId, projectId) {
    await db.query('UPDATE clock_entries SET clock_out_time = NOW() WHERE user_id = ? AND project_id = ? AND clock_out_time IS NULL', [userId, projectId]);
  }

  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM clock_entries WHERE user_id = ?', [userId]);
    return rows;
  }

  static async findByProjectId(projectId) {
    const [rows] = await db.query('SELECT * FROM clock_entries WHERE project_id = ?', [projectId]);
    return rows;
  }

  static async getHoursReport(userId, period) {
    let query = '';
    if (period === 'daily') {
      query = 'SELECT project_id, DATE(clock_in_time) as date, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, DATE(clock_in_time)';
    } else if (period === 'weekly') {
      query = 'SELECT project_id, YEARWEEK(clock_in_time) as week, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, YEARWEEK(clock_in_time)';
    } else if (period === 'monthly') {
      query = 'SELECT project_id, MONTH(clock_in_time) as month, SUM(TIMESTAMPDIFF(HOUR, clock_in_time, clock_out_time)) as hours FROM clock_entries WHERE user_id = ? GROUP BY project_id, MONTH(clock_in_time)';
    } else {
      throw new Error('Invalid period');
    }

    const [rows] = await db.query(query, [userId]);
    return rows;
  }
}

module.exports = ClockEntry;
