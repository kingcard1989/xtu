<template>
    <div class="course-charts">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-checkbox-group v-model="selectedCourses" @change="handleCourseChange">
            <el-checkbox 
              v-for="course in courses" 
              :key="course.name" 
              :label="course.name"
              :style="{ color: course.color }"
            >
              {{ course.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
  
        <el-col :span="24" style="margin-top: 20px;">
          <el-radio-group v-model="chartType">
            <el-radio-button label="line">折线图</el-radio-button>
            <el-radio-button label="histogram">柱状图</el-radio-button>
          </el-radio-group>
        </el-col>
  
        <el-col :span="24" style="margin-top: 20px;">
          <component
            :is="chartComponent"
            :data="chartData"
            :settings="chartSettings"
            :extend="chartExtend"
            height="400px"
          />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import VeLine from 'v-charts/lib/line.common'
  import VeHistogram from 'v-charts/lib/histogram.common'
  
  export default {
    components: {
      VeLine,
      VeHistogram
    },
  
    data() {
      return {
        // 课程配置
        courses: [
          { name: '格密码', color: '#409EFF' },
          { name: '课程2', color: '#67C23A' }
        ],
        
        // 选中的课程
        selectedCourses: ['格密码'],
        
        // 图表类型
        chartType: 'line',
        
        // 图表配置
        chartSettings: {
          xAxisType: 'category',
          yAxisName: ['学生数量'],
          labelMap: {
            date: '日期'
          }
        },
        
        // 图表扩展配置
        chartExtend: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            bottom: 0
          }
        },
        
        // 原始数据（模拟10天数据）
        rawData: {
          '格密码': [45, 52, 38, 65, 72, 48, 60, 55, 70, 62],
          '课程2': [38, 49, 55, 42, 58, 50, 62, 45, 53, 60]
        }
      }
    },
  
    computed: {
      // 动态图表组件
      chartComponent() {
        return this.chartType === 'line' ? VeLine : VeHistogram
      },
  
      // 处理后的图表数据
      chartData() {
        const dates = this.generateDates()
        const data = {
          columns: ['date', ...this.selectedCourses],
          rows: []
        }
  
        // 生成每日数据
        dates.forEach((date, index) => {
          const row = { date }
          this.selectedCourses.forEach(course => {
            row[course] = this.rawData[course][index]
          })
          data.rows.push(row)
        })
  
        return data
      },
  
      // 动态颜色设置
      chartSettingsWithColors() {
        return {
          ...this.chartSettings,
          colors: this.selectedCourses.map(name => 
            this.courses.find(c => c.name === name).color
          )
        }
      }
    },
  
    methods: {
      // 生成最近10天的日期
      generateDates() {
        const dates = []
        const today = new Date()
        
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          dates.push(date.toISOString().split('T')[0])
        }
        
        return dates
      },
  
      // 课程选择变化处理
      handleCourseChange(val) {
        if (val.length === 0) {
          this.$message.warning('请至少选择一个课程')
          this.selectedCourses = [this.courses[0].name]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .course-charts {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  
  .el-checkbox {
    margin-right: 20px;
  }
  </style>