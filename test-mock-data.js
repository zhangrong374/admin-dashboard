// 测试 mockData.ts 中的 API 方法
import { userAPI, roleAPI } from './src/utils/mockData.js';

// 测试用户管理功能
async function testUserManagement() {
  console.log('=== 测试用户管理功能 ===');

  // 获取初始用户列表
  console.log('\n1. 获取初始用户列表:');
  const initialUsers = await userAPI.getUsers();
  console.log('初始用户:', initialUsers);

  // 测试添加用户
  console.log('\n2. 测试添加用户:');
  const newUser = await userAPI.addUser({
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    role: 'user',
    status: 'active'
  });
  console.log('添加的用户:', newUser);

  // 获取添加后的用户列表
  const usersAfterAdd = await userAPI.getUsers();
  console.log('添加后的用户数量:', usersAfterAdd.length);

  // 测试编辑用户
  console.log('\n3. 测试编辑用户:');
  const userId = newUser.id;
  const updatedUser = await userAPI.updateUser(userId, {
    username: 'updateduser',
    email: 'updated@example.com'
  });
  console.log('更新后的用户:', updatedUser);

  // 获取编辑后的用户列表
  const usersAfterUpdate = await userAPI.getUsers();
  const editedUser = usersAfterUpdate.find(u => u.id === userId);
  console.log('编辑后的用户信息:', editedUser);

  // 测试删除用户
  console.log('\n4. 测试删除用户:');
  await userAPI.deleteUser(userId);

  // 获取删除后的用户列表
  const usersAfterDelete = await userAPI.getUsers();
  console.log('删除后的用户数量:', usersAfterDelete.length);
  const deletedUser = usersAfterDelete.find(u => u.id === userId);
  console.log('删除的用户是否存在:', deletedUser ? '是' : '否');

  console.log('\n=== 用户管理功能测试完成 ===');
}

// 测试角色管理功能
async function testRoleManagement() {
  console.log('\n\n=== 测试角色管理功能 ===');

  // 获取初始角色列表
  console.log('\n1. 获取初始角色列表:');
  const initialRoles = await roleAPI.getRoles();
  console.log('初始角色:', initialRoles);

  // 测试添加角色
  console.log('\n2. 测试添加角色:');
  const newRole = await roleAPI.addRole({
    name: '测试角色',
    description: '测试角色描述'
  });
  console.log('添加的角色:', newRole);

  // 获取添加后的角色列表
  const rolesAfterAdd = await roleAPI.getRoles();
  console.log('添加后的角色数量:', rolesAfterAdd.length);

  // 测试编辑角色
  console.log('\n3. 测试编辑角色:');
  const roleId = newRole.id;
  const updatedRole = await roleAPI.updateRole(roleId, {
    name: '更新的测试角色',
    description: '更新的测试角色描述'
  });
  console.log('更新后的角色:', updatedRole);

  // 获取编辑后的角色列表
  const rolesAfterUpdate = await roleAPI.getRoles();
  const editedRole = rolesAfterUpdate.find(r => r.id === roleId);
  console.log('编辑后的角色信息:', editedRole);

  // 测试删除角色
  console.log('\n4. 测试删除角色:');
  await roleAPI.deleteRole(roleId);

  // 获取删除后的角色列表
  const rolesAfterDelete = await roleAPI.getRoles();
  console.log('删除后的角色数量:', rolesAfterDelete.length);
  const deletedRole = rolesAfterDelete.find(r => r.id === roleId);
  console.log('删除的角色是否存在:', deletedRole ? '是' : '否');

  console.log('\n=== 角色管理功能测试完成 ===');
}

// 运行测试
async function runTests() {
  try {
    await testUserManagement();
    await testRoleManagement();
    console.log('\n\n=== 所有测试完成 ===');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

runTests();