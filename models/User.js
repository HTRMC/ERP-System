// models/User.js
const db = require('../config/db');

class User {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }

  static async create(user) {
    const { name, email, password, role } = user;
    const result = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
    return result[0].insertId;
  }

  static async updateRole(id, role) {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  }
}

module.exports = User;
