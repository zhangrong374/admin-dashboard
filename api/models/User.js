/**
 * 用户模型
 */

const { pool } = require('../config/database');

class User {
  // 获取所有用户
  static async getUsers() {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  }

  // 根据ID获取用户
  static async getUserById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // 根据用户名获取用户
  static async getUserByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  // 添加用户
  static async addUser(userData) {
    const { username, email, password, role, status } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, role, status]
    );
    return await this.getUserById(result.insertId);
  }

  // 更新用户
  static async updateUser(id, userData) {
    const { username, email, password, role, status } = userData;
    await pool.execute(
      'UPDATE users SET username = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?',
      [username, email, password, role, status, id]
    );
    return await this.getUserById(id);
  }

  // 删除用户
  static async deleteUser(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;