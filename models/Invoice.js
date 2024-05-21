// models/Invoice.js
const db = require('../config/db');

class Invoice {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM invoices');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(invoice) {
    const { user_id, project_id, hours_worked, pdf_path } = invoice;
    const result = await db.query('INSERT INTO invoices (user_id, project_id, hours_worked, pdf_path) VALUES (?, ?, ?, ?)', [user_id, project_id, hours_worked, pdf_path]);
    return result[0].insertId;
  }
}

module.exports = Invoice;
