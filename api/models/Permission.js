/**
 * 权限模型
 */

const { pool } = require('../config/database');

class Permission {
  // 获取所有权限
  static async getPermissions() {
    const [rows] = await pool.execute('SELECT * FROM permissions ORDER BY created_at DESC');
    return rows;
  }

  // 根据ID获取权限
  static async getPermissionById(id) {
    const [rows] = await pool.execute('SELECT * FROM permissions WHERE id = ?', [id]);
    return rows[0];
  }

  // 添加权限
  static async addPermission(permissionData) {
    const { name, code, description } = permissionData;
    const [result] = await pool.execute(
      'INSERT INTO permissions (name, code, description) VALUES (?, ?, ?)',
      [name, code, description]
    );
    return await this.getPermissionById(result.insertId);
  }

  // 更新权限
  static async updatePermission(id, permissionData) {
    const { name, code, description } = permissionData;
    await pool.execute(
      'UPDATE permissions SET name = ?, code = ?, description = ? WHERE id = ?',
      [name, code, description, id]
    );
    return await this.getPermissionById(id);
  }

  // 删除权限
  static async deletePermission(id) {
    const [result] = await pool.execute('DELETE FROM permissions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Permission;