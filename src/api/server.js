// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 导入 API 路由
const registedRoutes = require('./registed');
const loginRoutes = require('./login');
// 使用 API 路由
app.use('/api', registedRoutes);
app.use('/api',loginRoutes);
// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});