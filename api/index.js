const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin', status: 'active', created_at: new Date().toISOString() },
  { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123', role: 'user', status: 'active', created_at: new Date().toISOString() },
  { id: 3, username: 'user2', email: 'user2@example.com', password: 'user123', role: 'user', status: 'inactive', created_at: new Date().toISOString() }
];

let roles = [
  { id: 1, name: '管理员', description: '拥有所有权限', created_at: new Date().toISOString() },
  { id: 2, name: '普通用户', description: '基本权限', created_at: new Date().toISOString() },
  { id: 3, name: '编辑', description: '编辑权限', created_at: new Date().toISOString() }
];

let permissions = [
  { id: 1, name: '用户管理', description: '管理用户' },
  { id: 2, name: '角色管理', description: '管理角色' },
  { id: 3, name: '权限管理', description: '管理权限' },
  { id: 4, name: '数据查看', description: '查看数据' },
  { id: 5, name: '数据编辑', description: '编辑数据' },
  { id: 6, name: '系统设置', description: '系统设置' }
];

let rolePermissions = [
  { role_id: 1, permission_id: 1 },
  { role_id: 1, permission_id: 2 },
  { role_id: 1, permission_id: 3 },
  { role_id: 1, permission_id: 4 },
  { role_id: 1, permission_id: 5 },
  { role_id: 1, permission_id: 6 },
  { role_id: 2, permission_id: 4 },
  { role_id: 3, permission_id: 4 },
  { role_id: 3, permission_id: 5 }
];

let userIdCounter = 4;
let roleIdCounter = 4;

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const { username, email, password, role, status } = req.body;
  const newUser = {
    id: userIdCounter++,
    username,
    email,
    password,
    role: role || 'user',
    status: status || 'active',
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  res.json(newUser);
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, status } = req.body;
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    users[index] = { ...users[index], username, email, password, role, status };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/roles', (req, res) => {
  res.json(roles);
});

app.post('/roles', (req, res) => {
  const { name, description } = req.body;
  const newRole = {
    id: roleIdCounter++,
    name,
    description,
    created_at: new Date().toISOString()
  };
  roles.push(newRole);
  res.json(newRole);
});

app.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const index = roles.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    roles[index] = { ...roles[index], name, description };
    res.json(roles[index]);
  } else {
    res.status(404).json({ error: 'Role not found' });
  }
});

app.delete('/roles/:id', (req, res) => {
  const { id } = req.params;
  const index = roles.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    roles.splice(index, 1);
    res.json({ message: 'Role deleted successfully' });
  } else {
    res.status(404).json({ error: 'Role not found' });
  }
});

app.get('/permissions', (req, res) => {
  res.json(permissions);
});

app.get('/role-permissions/:roleId', (req, res) => {
  const { roleId } = req.params;
  const rolePerms = rolePermissions.filter(rp => rp.role_id === parseInt(roleId));
  const permIds = rolePerms.map(rp => rp.permission_id);
  res.json(permIds);
});

app.post('/role-permissions/:roleId', (req, res) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;

  rolePermissions = rolePermissions.filter(rp => rp.role_id !== parseInt(roleId));

  permissionIds.forEach(permId => {
    rolePermissions.push({ role_id: parseInt(roleId), permission_id: permId });
  });

  res.json({ message: 'Permissions saved successfully' });
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
