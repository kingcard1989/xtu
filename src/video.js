const express = require('express');
const path = require('path');

const app = express();
const PORT = 1238; // 设置端口号
const VIDEO_DIR = path.join(__dirname, './assets/video'); // 指定视频文件夹路径

const PDF_DIR = path.join(__dirname, './assets/pdf'); 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// 提供视频文件
app.use('/videos', express.static(VIDEO_DIR));
app.use('/pdfs', express.static(PDF_DIR));
// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行，访问 http://localhost:${PORT}`);
});