// models/Invoice.js
const db = require('../config/db');

class Invoice {
  static async createInvoice(userId, projectId, hoursWorked) {
    const result = await db.query('INSERT INTO invoices (user_id, project_id, hours_worked, invoice_date) VALUES (?, ?, ?, NOW())', [userId, projectId, hoursWorked]);
    return result[0].insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM invoices');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Invoice;
