// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8001; // 你可以根据需要更改端口

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 导入 API 路由
const userRoutes = require('./user');
const requestRoutes = require('./request');
const ossRoutes = require('./oss');
const eduRoutes = require('./edu');
const defaultRoutes = require('./default');

// 使用 API 路由
app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/oss', ossRoutes);
app.use('/api/edu', eduRoutes);
app.use('/api/default', defaultRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});