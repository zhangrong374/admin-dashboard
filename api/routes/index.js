/**
 * 路由配置
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// 用户相关路由
router.get('/users', async (req, res) => {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '获取用户失败' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await User.addUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: '添加用户失败' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: '更新用户失败' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const success = await User.deleteUser(req.params.id);
    if (success) {
      res.json({ message: '删除用户成功' });
    } else {
      res.status(404).json({ error: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除用户失败' });
  }
});

// 角色相关路由
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: '获取角色列表失败' });
  }
});

router.get('/roles/:id', async (req, res) => {
  try {
    const role = await Role.getRoleById(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ error: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '获取角色失败' });
  }
});

router.post('/roles', async (req, res) => {
  try {
    const role = await Role.addRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: '添加角色失败' });
  }
});

router.put('/roles/:id', async (req, res) => {
  try {
    const role = await Role.updateRole(req.params.id, req.body);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: '更新角色失败' });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    const success = await Role.deleteRole(req.params.id);
    if (success) {
      res.json({ message: '删除角色成功' });
    } else {
      res.status(404).json({ error: '角色不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除角色失败' });
  }
});

// 权限相关路由
router.get('/permissions', async (req, res) => {
  try {
    const permissions = await Permission.getPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: '获取权限列表失败' });
  }
});

router.get('/roles/:id/permissions', async (req, res) => {
  try {
    const permissions = await Role.getRolePermissions(req.params.id);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: '获取角色权限失败' });
  }
});

router.post('/roles/:id/permissions', async (req, res) => {
  try {
    const permissions = await Role.assignPermissions(req.params.id, req.body.permissionIds);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: '分配权限失败' });
  }
});

module.exports = router;