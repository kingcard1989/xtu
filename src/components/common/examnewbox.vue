<template>
    <el-dialog :visible.sync="visible" title="考试通知" @close="handleClose">
      <div class="exam-content">
        <h2>最近可以参加的考试</h2>
        <a href="#" target="_blank">网络安全常识------公共类</a>
        <a href="#" target="_blank">Web应用安全------Web应用基础</a>
        <p>请确保在开始考试之前，您已准备好所有必要的材料。</p>
        <p>考试时间：{{ examTime }}</p>
        <p>考试说明：{{ examDescription }}</p>
        <div class="exam-actions">
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script>
  export default {
    name: "examnewbox",
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        examTime: "60分钟", 
        examDescription: "本次考试包含选择题和简答题，请认真作答。", 
      };
    },
    methods: {
      
      handleClose() {
        this.$emit('close'); 
      },
    },
  };
  </script>
  
  <style scoped>
  .exam-content {
    padding: 20px;
  }
  
  .exam-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  </style>