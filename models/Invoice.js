const db = require('../config/db');

class Invoice {
  static async findAll() {
    const [rows] = await db.query(`
      SELECT invoices.*, projects.name AS project_name, users.name AS user_name
      FROM invoices
      JOIN projects ON invoices.project_id = projects.id
      JOIN users ON invoices.user_id = users.id
    `);
    return rows;
  }

  static async findById(invoiceId) {
    const [rows] = await db.query(`
      SELECT invoices.*, projects.name AS project_name, users.name AS user_name
      FROM invoices
      JOIN projects ON invoices.project_id = projects.id
      JOIN users ON invoices.user_id = users.id
      WHERE invoices.invoice_id = ?
    `, [invoiceId]);
    return rows[0];
  }

  static async create(invoice) {
    const { user_id, project_id, hours_worked, pdf_path, invoice_id, invoice_date } = invoice;
    const result = await db.query(
      'INSERT INTO invoices (user_id, project_id, hours_worked, pdf_path, invoice_id, invoice_date) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, project_id, hours_worked, pdf_path, invoice_id, invoice_date]
    );
    return result[0].insertId;
  }

  static async search(query) {
    const [rows] = await db.query(`
      SELECT invoices.*, projects.name AS project_name 
      FROM invoices 
      JOIN projects ON invoices.project_id = projects.id 
      WHERE invoices.invoice_id LIKE ? OR projects.name LIKE ?`, 
      [`%${query}%`, `%${query}%`]
    );
    return rows;
  }
}

module.exports = Invoice;
