const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8080;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接（先不指定数据库）
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connected successfully');

  // 创建数据库
  const dbName = process.env.DB_NAME || 'admin_dashboard';
  db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    // 重新连接到指定数据库
    db.changeUser({ database: dbName }, (err) => {
      if (err) {
        console.error('Error changing database:', err);
        return;
      }
      console.log('Switched to database:', dbName);
      // 创建表
      createTables();
    });
  });
});

// 创建表
const createTables = () => {
  // 用户表
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
  });

  // 角色表
  db.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating roles table:', err);
  });

  // 权限表
  db.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating permissions table:', err);
  });

  // 角色权限关联表
  db.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INT,
      permission_id INT,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating role_permissions table:', err);
  });
};

// API 路由

// 用户相关路由
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { username, email, password, role, status } = req.body;
  db.query(
    'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, role, status],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, ...req.body });
    }
  );
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, status } = req.body;
  db.query(
    'UPDATE users SET username = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?',
    [username, email, password, role, status, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, ...req.body });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// 角色相关路由
app.get('/roles', (req, res) => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/roles', (req, res) => {
  const { name, description } = req.body;
  db.query(
    'INSERT INTO roles (name, description) VALUES (?, ?)',
    [name, description],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, ...req.body });
    }
  );
});

app.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query(
    'UPDATE roles SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, ...req.body });
    }
  );
});

app.delete('/roles/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM roles WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Role deleted successfully' });
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});