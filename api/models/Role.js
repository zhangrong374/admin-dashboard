/**
 * 角色模型
 */

const { pool } = require('../config/database');

class Role {
  // 获取所有角色
  static async getRoles() {
    const [rows] = await pool.execute('SELECT * FROM roles ORDER BY created_at DESC');
    return rows;
  }

  // 根据ID获取角色
  static async getRoleById(id) {
    const [rows] = await pool.execute('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
  }

  // 添加角色
  static async addRole(roleData) {
    const { name, description } = roleData;
    const [result] = await pool.execute(
      'INSERT INTO roles (name, description) VALUES (?, ?)',
      [name, description]
    );
    return await this.getRoleById(result.insertId);
  }

  // 更新角色
  static async updateRole(id, roleData) {
    const { name, description } = roleData;
    await pool.execute(
      'UPDATE roles SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return await this.getRoleById(id);
  }

  // 删除角色
  static async deleteRole(id) {
    const [result] = await pool.execute('DELETE FROM roles WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // 获取角色权限
  static async getRolePermissions(roleId) {
    const [rows] = await pool.execute(
      'SELECT p.* FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role_id = ?',
      [roleId]
    );
    return rows;
  }

  // 分配权限给角色
  static async assignPermissions(roleId, permissionIds) {
    // 先删除现有权限
    await pool.execute('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
    
    // 添加新权限
    for (const permissionId of permissionIds) {
      await pool.execute(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [roleId, permissionId]
      );
    }
    
    return await this.getRolePermissions(roleId);
  }
}

module.exports = Role;