<template>
  <div class="data-analysis-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>数据分析</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateChange"
          />
        </div>
      </template>
      <div class="analysis-charts">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <span>用户活跃度</span>
              </template>
              <div ref="activeChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <span>用户来源</span>
              </template>
              <div ref="sourceChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card class="chart-card">
              <template #header>
                <span>访问趋势</span>
              </template>
              <div ref="trendChartRef" class="chart-container large"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>数据表格</span>
        </div>
      </template>
      <el-table :data="dataTable" style="width: 100%" border>
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="users" label="用户数" width="120" />
        <el-table-column prop="visits" label="访问量" width="120" />
        <el-table-column prop="bounceRate" label="跳出率" width="120">
          <template #default="scope">
            {{ scope.row.bounceRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="avgTime" label="平均停留时间" width="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const dateRange = ref([])
const activeChartRef = ref<HTMLElement>()
const sourceChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
let activeChart: echarts.ECharts | null = null
let sourceChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

const dataTable = ref([
  { date: '2024-01-01', users: 1200, visits: 3500, bounceRate: 45, avgTime: '2:30' },
  { date: '2024-01-02', users: 1350, visits: 4200, bounceRate: 42, avgTime: '2:45' },
  { date: '2024-01-03', users: 1100, visits: 3200, bounceRate: 48, avgTime: '2:15' },
  { date: '2024-01-04', users: 1450, visits: 4800, bounceRate: 38, avgTime: '3:00' },
  { date: '2024-01-05', users: 1600, visits: 5200, bounceRate: 35, avgTime: '3:15' }
])

onMounted(() => {
  initCharts()
})

const initCharts = () => {
  initActiveChart()
  initSourceChart()
  initTrendChart()

  window.addEventListener('resize', () => {
    activeChart?.resize()
    sourceChart?.resize()
    trendChart?.resize()
  })
}

const initActiveChart = () => {
  if (activeChartRef.value) {
    activeChart = echarts.init(activeChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['活跃用户', '新增用户']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          data: [1200, 1320, 1010, 1340, 900, 2300]
        },
        {
          name: '新增用户',
          type: 'line',
          data: [300, 420, 310, 440, 200, 600]
        }
      ]
    }
    activeChart.setOption(option)
  }
}

const initSourceChart = () => {
  if (sourceChartRef.value) {
    sourceChart = echarts.init(sourceChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '用户来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: '直接访问' },
            { value: 25, name: '搜索引擎' },
            { value: 20, name: '社交媒体' },
            { value: 15, name: '外部链接' },
            { value: 5, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    sourceChart.setOption(option)
  }
}

const initTrendChart = () => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['访问量', 'PV', 'UV']
      },
      xAxis: {
        type: 'category',
        data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          data: [1200, 1320, 1010, 1340, 900, 2300, 2100, 2500, 3000, 3200]
        },
        {
          name: 'PV',
          type: 'line',
          data: [3500, 4200, 3200, 4800, 3000, 6500, 6000, 7200, 8500, 9000]
        },
        {
          name: 'UV',
          type: 'line',
          data: [800, 950, 750, 1000, 650, 1800, 1600, 2000, 2500, 2700]
        }
      ]
    }
    trendChart.setOption(option)
  }
}

const handleDateChange = (val: any) => {
  // 处理日期范围变化
  console.log('Date range changed:', val)
}
</script>

<style scoped>
.data-analysis-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-charts {
  margin-top: 20px;
}

.chart-card {
  height: 300px;
}

.chart-container {
  height: 250px;
}

.chart-container.large {
  height: 400px;
}
</style>