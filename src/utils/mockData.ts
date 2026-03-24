// 模拟数据服务

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

// 模拟用户数据
let users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    password: 'user123',
    role: 'user',
    status: 'inactive',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    username: 'editor1',
    email: 'editor1@example.com',
    password: 'editor123',
    role: 'editor',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

// 模拟角色数据
let roles: Role[] = [
  {
    id: 1,
    name: '管理员',
    description: '拥有所有权限',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '普通用户',
    description: '基本权限',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: '编辑',
    description: '编辑权限',
    created_at: new Date().toISOString()
  }
];

// 模拟权限数据
// 注意：这个变量目前未使用，但保留以备将来扩展
// const permissions: Permission[] = [
//   { id: 11, name: '用户管理', description: '管理用户' },
//   { id: 12, name: '角色管理', description: '管理角色' },
//   { id: 13, name: '权限管理', description: '管理权限' },
//   { id: 21, name: '文章管理', description: '管理文章' },
//   { id: 22, name: '评论管理', description: '管理评论' },
//   { id: 23, name: '标签管理', description: '管理标签' },
//   { id: 31, name: '用户分析', description: '分析用户数据' },
//   { id: 32, name: '内容分析', description: '分析内容数据' },
//   { id: 33, name: '流量分析', description: '分析流量数据' }
// ];

// 模拟角色权限数据
let rolePermissions: RolePermission[] = [
  { role_id: 1, permission_id: 11 },
  { role_id: 1, permission_id: 12 },
  { role_id: 1, permission_id: 13 },
  { role_id: 1, permission_id: 21 },
  { role_id: 1, permission_id: 22 },
  { role_id: 1, permission_id: 23 },
  { role_id: 1, permission_id: 31 },
  { role_id: 1, permission_id: 32 },
  { role_id: 1, permission_id: 33 },
  { role_id: 2, permission_id: 31 },
  { role_id: 2, permission_id: 32 },
  { role_id: 3, permission_id: 21 },
  { role_id: 3, permission_id: 22 },
  { role_id: 3, permission_id: 23 },
  { role_id: 3, permission_id: 31 }
];

// 计数器
let userIdCounter = 5;

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 用户相关 API
export const userAPI = {
  // 获取所有用户
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return users;
  },

  // 添加用户
  addUser: async (user: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    await delay(300);
    // 计算新 ID，确保递增
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      ...user,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  // 更新用户
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    await delay(300);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1, { ...users[index], ...user });
      return users[index];
    }
    throw new Error('User not found');
  },

  // 删除用户
  deleteUser: async (id: number): Promise<void> => {
    await delay(300);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
    } else {
      throw new Error('User not found');
    }
  },

  // 登录
  login: async (username: string, password: string): Promise<{ token: string; user: User }> => {
    await delay(500);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return {
        token: `mock-token-${user.id}`,
        user
      };
    }
    throw new Error('Invalid username or password');
  },

  // 注册
  register: async (user: Omit<User, 'id' | 'created_at' | 'role' | 'status'>): Promise<User> => {
    await delay(500);
    // 检查用户名是否已存在
    if (users.some(u => u.username === user.username)) {
      throw new Error('Username already exists');
    }
    // 检查邮箱是否已存在
    if (users.some(u => u.email === user.email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      id: userIdCounter++,
      ...user,
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  }
};

// 角色相关 API
export const roleAPI = {
  // 获取所有角色
  getRoles: async (): Promise<Role[]> => {
    await delay(300);
    return roles;
  },

  // 添加角色
  addRole: async (role: Omit<Role, 'id' | 'created_at'>): Promise<Role> => {
    await delay(300);
    // 计算新 ID，确保递增
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    const newRole: Role = {
      id: newId,
      ...role,
      created_at: new Date().toISOString()
    };
    roles.push(newRole);
    return newRole;
  },

  // 更新角色
  updateRole: async (id: number, role: Partial<Role>): Promise<Role> => {
    await delay(300);
    const index = roles.findIndex(r => r.id === id);
    if (index !== -1) {
      roles.splice(index, 1, { ...roles[index], ...role });
      return roles[index];
    }
    throw new Error('Role not found');
  },

  // 删除角色
  deleteRole: async (id: number): Promise<void> => {
    await delay(300);
    const index = roles.findIndex(r => r.id === id);
    if (index !== -1) {
      roles.splice(index, 1);
      // 同时删除相关的角色权限
      rolePermissions = rolePermissions.filter(rp => rp.role_id !== id);
    } else {
      throw new Error('Role not found');
    }
  }
};

// 权限相关 API
export const permissionAPI = {
  // 获取角色权限
  getRolePermissions: async (roleId: number): Promise<number[]> => {
    await delay(300);
    return rolePermissions
      .filter(rp => rp.role_id === roleId)
      .map(rp => rp.permission_id);
  },

  // 保存角色权限
  saveRolePermissions: async (roleId: number, permissionIds: number[]): Promise<void> => {
    await delay(300);
    // 移除该角色的所有权限
    rolePermissions = rolePermissions.filter(rp => rp.role_id !== roleId);
    // 添加新的权限
    permissionIds.forEach(permId => {
      rolePermissions.push({ role_id: roleId, permission_id: permId });
    });
  }
};

// 健康检查
export const healthAPI = {
  check: async (): Promise<{ status: string }> => {
    await delay(100);
    return { status: 'ok' };
  }
};
