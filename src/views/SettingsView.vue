<template>
  <div class="settings-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            label-width="120px"
          >
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统Logo" prop="systemLogo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleLogoUpload"
              >
                <img v-if="basicForm.systemLogo" :src="basicForm.systemLogo" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="系统描述" prop="systemDescription">
              <el-input
                v-model="basicForm.systemDescription"
                type="textarea"
                placeholder="请输入系统描述"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="basicForm.copyright" placeholder="请输入版权信息" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮件设置" name="email">
          <el-form
            ref="emailFormRef"
            :model="emailForm"
            label-width="120px"
          >
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input v-model.number="emailForm.smtpPort" placeholder="请输入SMTP端口" />
            </el-form-item>
            <el-form-item label="发件人邮箱" prop="senderEmail">
              <el-input v-model="emailForm.senderEmail" type="email" placeholder="请输入发件人邮箱" />
            </el-form-item>
            <el-form-item label="发件人名称" prop="senderName">
              <el-input v-model="emailForm.senderName" placeholder="请输入发件人名称" />
            </el-form-item>
            <el-form-item label="SMTP密码" prop="smtpPassword">
              <el-input v-model="emailForm.smtpPassword" type="password" placeholder="请输入SMTP密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEmailSettings">保存设置</el-button>
              <el-button @click="testEmailConnection">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="安全设置" name="security">
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            label-width="120px"
          >
            <el-form-item label="登录失败限制" prop="loginFailLimit">
              <el-input v-model.number="securityForm.loginFailLimit" placeholder="请输入登录失败限制次数" />
            </el-form-item>
            <el-form-item label="密码复杂度" prop="passwordComplexity">
              <el-select v-model="securityForm.passwordComplexity" placeholder="请选择密码复杂度">
                <el-option label="低" value="low" />
                <el-option label="中" value="medium" />
                <el-option label="高" value="high" />
              </el-select>
            </el-form-item>
            <el-form-item label="会话超时" prop="sessionTimeout">
              <el-input v-model.number="securityForm.sessionTimeout" placeholder="请输入会话超时时间（分钟）" />
            </el-form-item>
            <el-form-item label="启用两步验证" prop="twoFactorAuth">
              <el-switch v-model="securityForm.twoFactorAuth" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

// 从本地存储加载设置
const loadSettings = () => {
  const savedBasic = localStorage.getItem('basicSettings')
  const savedEmail = localStorage.getItem('emailSettings')
  const savedSecurity = localStorage.getItem('securitySettings')
  
  if (savedBasic) {
    Object.assign(basicForm, JSON.parse(savedBasic))
  }
  if (savedEmail) {
    Object.assign(emailForm, JSON.parse(savedEmail))
  }
  if (savedSecurity) {
    Object.assign(securityForm, JSON.parse(savedSecurity))
  }
}

const basicForm = reactive({
  systemName: 'VueAdmin - 权限管理与数据分析平台',
  systemLogo: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  systemDescription: '一个功能强大的中后台管理系统',
  copyright: '© 2024 管理系统 版权所有'
})

const emailForm = reactive({
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  senderEmail: 'admin@example.com',
  senderName: '系统管理员',
  smtpPassword: ''
})

const securityForm = reactive({
  loginFailLimit: 5,
  passwordComplexity: 'medium',
  sessionTimeout: 30,
  twoFactorAuth: false
})

// 页面加载时加载设置
onMounted(() => {
  loadSettings()
})

const basicFormRef = ref()
const emailFormRef = ref()
const securityFormRef = ref()

const handleLogoUpload = (file: any) => {
  // 模拟上传操作
  basicForm.systemLogo = URL.createObjectURL(file.raw)
}

const saveBasicSettings = () => {
  // 保存到本地存储
  localStorage.setItem('basicSettings', JSON.stringify(basicForm))
  console.log('Save basic settings:', basicForm)
  // 显示保存成功提示
  ElMessage.success('基本设置保存成功')
}

const saveEmailSettings = () => {
  // 保存到本地存储
  localStorage.setItem('emailSettings', JSON.stringify(emailForm))
  console.log('Save email settings:', emailForm)
  // 显示保存成功提示
  ElMessage.success('邮件设置保存成功')
}

const saveSecuritySettings = () => {
  // 保存到本地存储
  localStorage.setItem('securitySettings', JSON.stringify(securityForm))
  console.log('Save security settings:', securityForm)
  // 显示保存成功提示
  ElMessage.success('安全设置保存成功')
}

const testEmailConnection = () => {
  // 模拟测试连接
  console.log('Test email connection:', emailForm)
}
</script>

<style scoped>
.settings-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>