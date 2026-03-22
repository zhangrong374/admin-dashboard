<template>
  <div class="roles-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" @click="openAddRoleDialog">
            <el-icon><i-ep-plus /></el-icon>
            <span>添加角色</span>
          </el-button>
        </div>
      </template>
      <el-table :data="rolesData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editRole(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限配置卡片 -->
    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>权限配置</span>
          <el-select v-model="selectedRoleId" placeholder="选择角色">
            <el-option
              v-for="role in rolesData"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </div>
      </template>
      <el-tree
        :data="permissionTree"
        show-checkbox
        node-key="id"
        default-expand-all
        @check-change="handleCheckChange"
      />
      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <el-button type="primary" @click="savePermissions">保存权限</el-button>
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const rolesData = ref<any[]>([])
const selectedRoleId = ref(1)

// 监听角色选择变化
watch(selectedRoleId, (newRoleId) => {
  if (newRoleId) {
    loadRolePermissions(newRoleId)
  }
})

const permissionTree = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      { id: 11, label: '用户管理' },
      { id: 12, label: '角色管理' },
      { id: 13, label: '权限管理' }
    ]
  },
  {
    id: 2,
    label: '内容管理',
    children: [
      { id: 21, label: '文章管理' },
      { id: 22, label: '评论管理' },
      { id: 23, label: '标签管理' }
    ]
  },
  {
    id: 3,
    label: '数据分析',
    children: [
      { id: 31, label: '用户分析' },
      { id: 32, label: '内容分析' },
      { id: 33, label: '流量分析' }
    ]
  }
])

// 加载角色数据
const loadRoles = async () => {
  try {
    console.log('Loading roles...')
    const response = await axios.get('/api/roles')
    console.log('Roles loaded:', response.data)
    rolesData.value = response.data
    if (rolesData.value.length > 0) {
      selectedRoleId.value = rolesData.value[0].id
      // 加载该角色的权限
      await loadRolePermissions(selectedRoleId.value)
    }
  } catch (error: any) {
    console.error('Error loading roles:', error)
    ElMessage.error('加载角色数据失败')
  }
}

// 加载角色权限
const loadRolePermissions = async (roleId: number) => {
  try {
    console.log('Loading permissions for role:', roleId)
    const response = await axios.get(`/api/role-permissions/${roleId}`)
    console.log('Permissions loaded:', response.data)
    
    // 更新权限树的选中状态
    const permIds = response.data
    permissionTree.value.forEach((node: any) => {
      if (node.children) {
        node.children.forEach((child: any) => {
          child.checked = permIds.includes(child.id)
        })
      }
    })
  } catch (error: any) {
    console.error('Error loading permissions:', error)
  }
}

// 页面加载时加载角色数据
onMounted(() => {
  loadRoles()
})

const dialogVisible = ref(false)
const dialogTitle = ref('添加角色')
const roleForm = reactive({
  id: '',
  name: '',
  description: ''
})
const roleFormRef = ref()

const openAddRoleDialog = () => {
  dialogTitle.value = '添加角色'
  Object.assign(roleForm, {
    id: '',
    name: '',
    description: ''
  })
  dialogVisible.value = true
}

const editRole = (role: any) => {
  dialogTitle.value = '编辑角色'
  Object.assign(roleForm, role)
  dialogVisible.value = true
}

const saveRole = async () => {
  try {
    console.log('Saving role:', roleForm)
    if (roleForm.id) {
      // 编辑
      await axios.put(`/api/roles/${roleForm.id}`, roleForm)
      ElMessage.success('角色更新成功')
    } else {
      // 添加
      await axios.post('/api/roles', roleForm)
      ElMessage.success('角色添加成功')
    }
    // 重新加载角色数据
    await loadRoles()
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error saving role:', error)
    ElMessage.error('保存角色失败')
  }
}

const deleteRole = async (id: number) => {
  try {
    console.log(`Deleting role with id: ${id}`)
    await axios.delete(`/api/roles/${id}`)
    ElMessage.success('角色删除成功')
    // 重新加载角色数据
    await loadRoles()
  } catch (error: any) {
    console.error('Error deleting role:', error)
    ElMessage.error('删除角色失败')
  }
}

const handleCheckChange = (data: any, checked: boolean, indeterminate: boolean) => {
  // 处理权限勾选变化
  console.log('Permission check change:', data, checked, indeterminate)
}

const savePermissions = async () => {
  try {
    console.log('Save permissions for role:', selectedRoleId.value)
    
    // 获取选中的权限 ID
    const checkedKeys = permissionTree.value.reduce((acc: number[], node: any) => {
      if (node.children) {
        node.children.forEach((child: any) => {
          if (child.checked) {
            acc.push(child.id)
          }
        })
      }
      return acc
    }, [])
    
    console.log('Checked permission IDs:', checkedKeys)
    
    // 调用 API 保存权限
    await axios.post(`/api/role-permissions/${selectedRoleId.value}`, {
      permissionIds: checkedKeys
    })
    
    ElMessage.success('权限保存成功')
  } catch (error: any) {
    console.error('Error saving permissions:', error)
    ElMessage.error('保存权限失败')
  }
}
</script>

<style scoped>
.roles-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>