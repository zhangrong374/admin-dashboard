<template>
  <div class="dashboard-container">
    <el-card class="dashboard-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统概览</span>
        </div>
      </template>
      <div class="dashboard-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.users }}</div>
                <div class="stat-label">用户总数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.roles }}</div>
                <div class="stat-label">角色数量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.permissions }}</div>
                <div class="stat-label">权限项</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ stats.active }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="dashboard-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>用户增长趋势</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <el-card class="dashboard-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>最近操作</span>
        </div>
      </template>
      <el-table :data="recentActivities" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const stats = ref({
  users: 1234,
  roles: 12,
  permissions: 45,
  active: 567
})

const recentActivities = ref([
  { id: 1, action: '创建用户', user: '管理员', time: '2024-01-01 10:00', status: 'success' },
  { id: 2, action: '修改角色权限', user: '管理员', time: '2024-01-01 09:30', status: 'success' },
  { id: 3, action: '删除用户', user: '管理员', time: '2024-01-01 08:15', status: 'danger' },
  { id: 4, action: '登录系统', user: '张三', time: '2024-01-01 07:45', status: 'success' },
  { id: 5, action: '修改个人信息', user: '李四', time: '2024-01-01 07:00', status: 'success' }
])

onMounted(() => {
  initChart()
})

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '用户增长',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210, 250, 300, 320, 350, 400],
          areaStyle: {}
        }
      ]
    }
    chart.setOption(option)

    window.addEventListener('resize', () => {
      chart?.resize()
    })
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.chart-container {
  height: 400px;
}
</style>