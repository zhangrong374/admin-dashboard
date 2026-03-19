<template>
  <div class="app-container">
    <el-container style="height: 100vh; overflow: hidden;">
      <el-aside width="200px" style="background-color: #303133;">
        <div class="logo">
          <h1>管理系统</h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          background-color="#303133"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><i-ep-home /></el-icon>
            <span>仪表盘</span>
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
            <el-icon><i-ep-data-analysis /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><i-ep-setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="background-color: #fff; border-bottom: 1px solid #e4e7ed;">
          <div class="header-left">
            <el-button
              type="text"
              @click="isCollapse = !isCollapse"
              style="margin-right: 20px"
            >
              <el-icon><i-ep-menu /></el-icon>
            </el-button>
            <span>中后台管理系统</span>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userAvatar"></el-avatar>
                <span style="margin-left: 8px;">{{ userName }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                <el-dropdown-item @click="handlePersonalCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main style="padding: 20px; overflow-y: auto;">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => {
  const path = router.currentRoute.value.path
  return path
})

const userName = computed(() => userStore.userName)
const userAvatar = computed(() => userStore.userAvatar)

const handlePersonalCenter = () => {
  // 跳转到个人中心页面
  console.log('Navigate to personal center')
  // 实际项目中可以添加路由跳转
  // router.push('/personal-center')
}

const handleLogout = () => {
  // 退出登录
  console.log('Logout')
  // 调用用户 store 的 logout 方法
  userStore.logout()
  // 跳转到登录页面
  // router.push('/login')
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  border-bottom: 1px solid #404040;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>