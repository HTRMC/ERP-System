const db = require('../config/db');

class Invoice {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM invoices');
    return rows;
  }

  static async findById(invoiceId) {
    const [rows] = await db.query('SELECT * FROM invoices WHERE invoice_id = ?', [invoiceId]);
    return rows[0];
  }

  static async create(invoice) {
    const { user_id, project_id, hours_worked, pdf_path, invoice_id } = invoice;
    const result = await db.query(
      'INSERT INTO invoices (user_id, project_id, hours_worked, pdf_path, invoice_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, project_id, hours_worked, pdf_path, invoice_id]
    );
    return result[0].insertId;
  }
}

module.exports = Invoice;
