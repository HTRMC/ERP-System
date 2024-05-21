// models/User.js
const db = require('../config/db');

class User {
  static async findById(id) {
    const [rows] = await db.query('SELECT users.*, roles.role_name as role FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT users.*, roles.role_name as role FROM users JOIN roles ON users.role_id = roles.id WHERE users.email = ?', [email]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.query('SELECT users.*, roles.role_name as role FROM users JOIN roles ON users.role_id = roles.id');
    return rows;
  }

  static async create(user) {
    const { name, email, password, role_id } = user;
    const result = await db.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', [name, email, password, role_id]);
    return result[0].insertId;
  }

  static async updateRole(id, role_id) {
    await db.query('UPDATE users SET role_id = ? WHERE id = ?', [role_id, id]);
  }
}

module.exports = User;

