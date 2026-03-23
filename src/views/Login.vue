<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>用户登录</h2>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item>
          <div class="login-footer">
            <span>还没有账号？</span>
            <el-button type="text" @click="goToRegister">立即注册</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="test-account">
            <h4>测试账号：</h4>
            <p>管理员: admin / admin123</p>
            <p>普通用户: user1 / user123</p>
            <p>编辑: editor1 / editor123</p>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userAPI } from '../utils/mockData'

const router = useRouter()
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: ''
})

const login = async () => {
  try {
    // 验证表单
    if (!loginForm.username) {
      ElMessage.error('请输入用户名')
      return
    }
    if (!loginForm.password) {
      ElMessage.error('请输入密码')
      return
    }

    // 调用登录 API
    const response = await userAPI.login(loginForm.username, loginForm.password)
    
    // 保存登录状态
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    ElMessage.success('登录成功')
    
    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    ElMessage.error(`登录失败: ${error.message || '用户名或密码错误'}`)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.login-footer {
  text-align: center;
  margin-top: 15px;
}

.test-account {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f9eb;
  border: 1px solid #e1f5fe;
  border-radius: 4px;
}

.test-account h4 {
  margin-top: 0;
  color: #67c23a;
}

.test-account p {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}
</style>
