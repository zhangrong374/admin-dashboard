<template>
  <div class="app-container">
    <el-container class="app-wrapper">
      <el-aside width="200px" class="app-sidebar">
        <div class="sidebar-header">
          <h1 class="logo">管理系统</h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          router
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <el-icon><i-ep-home /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><i-ep-user /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/roles">
            <el-icon><i-ep-sold-out /></el-icon>
            <span>角色权限</span>
          </el-menu-item>
          <el-menu-item index="/data-analysis">
            <el-icon><i-ep-data-line /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><i-ep-setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="60px" class="app-header">
          <div class="header-left">
            <el-button
              type="info"
              plain
              icon="i-ep-menu"
              @click="toggleSidebar"
              class="menu-toggle"
            />
            <span class="header-title">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-dropdown">
                <el-avatar :size="32" :src="userAvatar"></el-avatar>
                <span class="username">{{ currentUser.username }}</span>
                <el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToSettings">
                    <el-icon><i-ep-setting /></el-icon>
                    <span>个人设置</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="logout">
                    <el-icon><i-ep-switch-button /></el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const currentUser = ref({
  username: '管理员'
})
const userAvatar = ref('')

// 页面标题映射
const pageTitles = {
  '/': '控制台',
  '/users': '用户管理',
  '/roles': '角色权限',
  '/data-analysis': '数据分析',
  '/settings': '系统设置'
}

// 当前页面标题
const currentPageTitle = computed(() => {
  return pageTitles[route.path as keyof typeof pageTitles] || '管理系统'
})

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 加载用户信息
const loadUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      currentUser.value = user
      // 生成基于用户名的头像
      userAvatar.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
}

// 监听路由变化
watch(() => route.path, () => {
  // 确保用户信息已加载
  loadUserInfo()
})

// 页面加载时
onMounted(() => {
  loadUserInfo()
  
  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (!token && route.path !== '/login' && route.path !== '/register') {
    router.push('/login')
  }
})

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 处理菜单选择
const handleMenuSelect = (key: string, keyPath: string[]) => {
  console.log('Menu selected:', key, keyPath)
}

// 跳转到个人设置
const goToSettings = () => {
  router.push('/settings')
}

// 退出登录
const logout = () => {
  // 清除登录状态
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  ElMessage.success('退出登录成功')
  
  // 跳转到登录页面
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.app-wrapper {
  height: 100vh;
}

.app-sidebar {
  background-color: #1f2329;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow: hidden;
  transition: width 0.3s;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #303641;
}

.logo {
  color: #fff;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.el-menu-vertical-demo {
  height: calc(100vh - 60px);
  background-color: #1f2329;
  border-right: none;
}

.el-menu-item {
  height: 56px;
  line-height: 56px;
  margin: 0 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #8a919f;
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.el-menu-item.is-active {
  background-color: #007bff;
  color: #fff;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.app-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f0f2f5;
}

.username {
  margin: 0 10px;
  font-size: 14px;
  color: #303133;
}

.app-main {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .app-sidebar {
    width: 64px !important;
  }
  
  .logo {
    font-size: 0;
  }
  
  .el-menu-item span {
    display: none;
  }
  
  .el-menu-item .el-icon {
    margin-right: 0;
  }
}
</style>
