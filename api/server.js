const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let db = null;

const initDatabase = () => {
  if (db) return db;
  
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'admin_dashboard'
  });

  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err);
        reject(err);
        return;
      }
      console.log('Database connected successfully');
      createTables();
      resolve(db);
    });
  });
};

const createTables = () => {
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

  db.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating permissions table:', err);
  });

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

app.get('/users', async (req, res) => {
  try {
    await initDatabase();
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    await initDatabase();
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    await initDatabase();
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await initDatabase();
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/roles', async (req, res) => {
  try {
    await initDatabase();
    db.query('SELECT * FROM roles', (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/roles', async (req, res) => {
  try {
    await initDatabase();
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/roles/:id', async (req, res) => {
  try {
    await initDatabase();
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/roles/:id', async (req, res) => {
  try {
    await initDatabase();
    const { id } = req.params;
    db.query('DELETE FROM roles WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Role deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
