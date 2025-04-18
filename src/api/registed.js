const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // 使用 bcryptjs
const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 替换为您的 MySQL 用户名
    password: '219332', // 替换为您的 MySQL 密码
    database: 'learning_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// 注册 API
router.post('/register', (req, res) => {
    const { stuId, email, password } = req.body;

    // 验证输入
    if (!stuId || !email || !password) {
        return res.status(400).json({ code: 40000, message: '所有字段都是必需的' });
    }

    // 哈希密码
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 插入用户到数据库
    const sql = 'INSERT INTO users (stuId, email, password) VALUES (?, ?, ?)';
    db.query(sql, [stuId, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ code: 40001, message: '学号或邮箱已被注册' });
            }
            return res.status(500).json({ code: 50000, message: '注册失败，请重试' });
        }
        res.status(200).json({ code: 20000, message: '注册成功' });
    });
});

// 导出路由
module.exports = router;