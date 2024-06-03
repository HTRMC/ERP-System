// models/Project.js
const db = require('../config/db');

class Project {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM projects');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(project) {
    const { name, description, start_date, end_date, company_name, contact_name, company_address, company_zip, company_country } = project;
    const result = await db.query('INSERT INTO projects (name, description, start_date, end_date, company_name, contact_name, company_address, company_zip, company_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, description, start_date, end_date, company_name, contact_name, company_address, company_zip, company_country]);
    return result[0].insertId;
  }
}

module.exports = Project;
