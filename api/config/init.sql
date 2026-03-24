-- 数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS admin_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE admin_dashboard;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY (role_id, permission_id)
);

-- 插入初始数据
-- 初始角色
INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'admin', '管理员'),
(2, 'editor', '编辑'),
(3, 'user', '普通用户');

-- 初始权限
INSERT IGNORE INTO permissions (id, name, code, description) VALUES
(1, '系统管理', 'system:manage', '系统管理权限'),
(2, '用户管理', 'user:manage', '用户管理权限'),
(3, '角色管理', 'role:manage', '角色管理权限'),
(4, '权限管理', 'permission:manage', '权限管理权限'),
(5, '数据查看', 'data:view', '数据查看权限');

-- 初始角色权限关联
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- 管理员拥有所有权限
(2, 2), (2, 3), (2, 5), -- 编辑拥有部分权限
(3, 5); -- 普通用户只有查看权限

-- 初始用户（密码为：admin123）
INSERT IGNORE INTO users (id, username, email, password, role, status) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$e1e3a7H6Z8b8K6m7L8n9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0k', 'admin', 'active');
