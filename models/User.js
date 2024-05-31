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
    const [rows] = await db.query('SELECT users.*, roles.role_name as role FROM users JOIN roles ON users.role_id = roles.id');
    return rows;
  }

  static async findByResetToken(token) {
    const [rows] = await db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [token, Date.now()]);
    return rows[0];
  }

  static async create(user) {
    const { name, email, password, role_id } = user;
    const result = await db.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', [name, email, password, role_id]);
    return result[0].insertId;
  }

  static async updateRole(id, role_id) {
    await db.query('UPDATE users SET role_id = ? WHERE id = ?', [role_id, id]);
  }

  static async updatePassword(id, password) {
    await db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?', [password, id]);
  }

  static async setResetToken(email, token, expires) {
    await db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?', [token, expires, email]);
  }
}

module.exports = User;
