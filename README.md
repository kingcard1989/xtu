## 注：由于我们采用前后端分离的开发模式，直接上传后端源码可能会导致合并冲突，所以我们的后端人员各自开了仓库来提交后端代码。链接如下：
- [https://github.com/cyfqhyjs/xtu-main-backend](https://github.com/cyfqhyjs/Student-Management-System)
- https://github.com/waterbALLI/BE-xtu


# XTU在线学习平台

## 项目介绍
这是一个基于Vue.js开发的在线学习平台前端项目，集成了在线考试、课程学习、问答交流等功能。

## 环境要求
- Node.js (建议版本 >= 12.0.0)
- npm (建议版本 >= 6.0.0)

## 技术栈
- Vue.js 2.6.11
- Vue Router 3.2.0
- Vuex 3.6.2
- Element UI 2.14.1
- Axios
- V-MD-Editor (Markdown编辑器)
- DPlayer (视频播放器)
- ECharts (图表库)

## 安装步骤

1. 克隆项目到本地
```bash
git clone [项目地址]
cd xtu
```

2. 安装项目依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run serve
```
启动成功后，访问 http://localhost:8080

4. 项目打包
```bash
npm run build
```

## 项目结构
```
├── public/          # 静态资源目录
├── src/             # 源代码目录
│   ├── api/         # API接口
│   ├── assets/      # 资源文件
│   ├── components/  # 公共组件
│   ├── router/      # 路由配置
│   ├── store/       # Vuex状态管理
│   ├── utils/       # 工具函数
│   ├── views/       # 页面组件
│   ├── App.vue      # 根组件
│   └── main.js      # 入口文件
├── package.json     # 项目依赖
└── vue.config.js    # Vue配置文件
```

## 主要功能
- 用户认证：登录、注册
- 课程中心：课程浏览、视频播放
- 在线考试：答题、成绩查看
- 问答社区：发帖、回复
- 个人中心：信息管理

## 开发注意事项
1. 确保Node.js和npm已正确安装
2. 建议使用VSCode作为开发工具
3. 推荐安装Vue Devtools浏览器插件辅助开发
4. 遵循项目既定的代码规范和组件开发规范

## 常见问题
1. 如果安装依赖时出现错误，可以尝试：
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

2. 启动开发服务器时如果端口被占用，可以修改`vue.config.js`中的端口配置

## 浏览器支持
- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证
[MIT License](LICENSE)
