<template>
  <div class="users-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openAddUserDialog">
            <el-icon><i-ep-plus /></el-icon>
            <span>添加用户</span>
          </el-button>
        </div>
      </template>
      <div class="users-filter">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="filterForm.username"
              placeholder="用户名"
              prefix-icon="i-ep-search"
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filterForm.email"
              placeholder="邮箱"
              prefix-icon="i-ep-message"
            />
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterForm.role"
              placeholder="角色"
              clearable
            >
              <el-option
                v-for="role in roles"
                :key="role.value"
                :label="role.label"
                :value="role.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchUsers">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="filteredUsers" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="active"
              inactive-value="inactive"
              @change="updateUserStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editUser(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option
              v-for="role in roles"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            active-value="active"
            inactive-value="inactive"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userAPI } from '../utils/mockData'

const filterForm = reactive({
  username: '',
  email: '',
  role: ''
})

const roles = ref([
  { value: 'admin', label: '管理员' },
  { value: 'user', label: '普通用户' },
  { value: 'editor', label: '编辑' }
])

// 原始用户数据
const usersData = ref<any[]>([])

// 过滤后的用户数据
const filteredUsers = ref<any[]>([])

// 加载用户数据
const loadUsers = async () => {
  try {
    console.log('=== Loading Users ===')
    const users = await userAPI.getUsers()
    usersData.value = users
    filteredUsers.value = [...usersData.value]
    pagination.total = users.length
    console.log('Users data updated:', usersData.value)
    console.log('Filtered users updated:', filteredUsers.value)
    console.log('=== Load Users Completed ===')
  } catch (error: any) {
    console.error('=== Load Users Error ===')
    console.error('Error:', error)
    ElMessage.error(`加载失败: ${error.message || '服务器错误'}`)
  }
}

// 页面加载时加载用户数据
onMounted(() => {
  console.log('=== Component mounted ===')
  console.log('Initial usersData:', usersData.value)
  console.log('Initial filteredUsers:', filteredUsers.value)
  loadUsers()
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const userForm = reactive({
  id: 0,
  username: '',
  email: '',
  password: '',
  role: '',
  status: 'active'
})
const userFormRef = ref()

const openAddUserDialog = () => {
  dialogTitle.value = '添加用户'
  Object.assign(userForm, {
    id: 0,
    username: '',
    email: '',
    password: '',
    role: 'user', // 设置默认角色
    status: 'active'
  })
  dialogVisible.value = true
  console.log('Add user dialog opened:', userForm)
}

const editUser = (user: any) => {
  dialogTitle.value = '编辑用户'
  Object.assign(userForm, user)
  dialogVisible.value = true
}

const saveUser = async () => {
  try {
    console.log('=== Save User ===')
    console.log('Form data:', userForm)
    
    // 验证表单
    if (!userForm.username) {
      ElMessage.error('请输入用户名')
      return
    }
    if (!userForm.email) {
      ElMessage.error('请输入邮箱')
      return
    }
    if (!userForm.password) {
      ElMessage.error('请输入密码')
      return
    }
    if (!userForm.role) {
      ElMessage.error('请选择角色')
      return
    }
    
    if (userForm.id > 0) {
      // 编辑
      const { id, ...updateData } = userForm
      await userAPI.updateUser(id, updateData)
      ElMessage.success('用户更新成功')
    } else {
      // 添加
      const { id, ...addData } = userForm
      await userAPI.addUser(addData)
      ElMessage.success('用户添加成功')
    }
    
    // 重新加载用户数据
    console.log('Reloading users...')
    await loadUsers()
    
    // 关闭对话框
    dialogVisible.value = false
    console.log('=== Save User Completed ===')
  } catch (error: any) {
    console.error('=== Save User Error ===')
    console.error('Error:', error)
    ElMessage.error(`保存失败: ${error.message || '服务器错误'}`)
  }
}

const deleteUser = async (id: number) => {
  try {
    console.log(`Deleting user with id: ${id}`)
    await userAPI.deleteUser(id)
    ElMessage.success('用户删除成功')
    // 重新加载用户数据
    await loadUsers()
  } catch (error: any) {
    console.error('Error deleting user:', error)
    ElMessage.error('删除用户失败')
  }
}

const updateUserStatus = async (user: any) => {
  try {
    console.log(`Updating user status for id: ${user.id}`)
    await userAPI.updateUser(user.id, user)
    ElMessage.success('状态更新成功')
    // 重新加载用户数据
    await loadUsers()
  } catch (error: any) {
    console.error('Error updating user status:', error)
    ElMessage.error('状态更新失败')
    // 重新加载用户数据以恢复原始状态
    await loadUsers()
  }
}

const searchUsers = () => {
  // 实现搜索功能
  const { username, email, role } = filterForm
  filteredUsers.value = usersData.value.filter(user => {
    const matchUsername = !username || user.username.includes(username)
    const matchEmail = !email || user.email.includes(email)
    const matchRole = !role || user.role === role
    return matchUsername && matchEmail && matchRole
  })
  // 重置页码
  pagination.currentPage = 1
  console.log('Search users:', filterForm)
  console.log('Filtered users:', filteredUsers.value)
}

const resetFilter = () => {
  Object.assign(filterForm, {
    username: '',
    email: '',
    role: ''
  })
  // 重置过滤后的数据
  filteredUsers.value = [...usersData.value]
  // 重置页码
  pagination.currentPage = 1
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
}
</script>

<style scoped>
.users-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.users-filter {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
