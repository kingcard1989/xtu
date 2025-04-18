



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

// 登录 API


router.post('/login', (req, res) => {
    const { stuId, password } = req.body;

    // 验证输入
    if (!stuId || !password) {
        return res.status(400).json({ code: 40000, message: '学号和密码都是必需的' });
    }

    // 查询用户
    const sql = 'SELECT * FROM users WHERE stuId = ?';
    db.query(sql, [stuId], (err, results) => {
        if (err) {
            return res.status(500).json({ code: 50000, message: '登录失败，请重试' });
        }
        if (results.length === 0) {
            return res.status(401).json({ code: 40001, message: '用户不存在' });
        }

        const user = results[0];

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ code: 40002, message: '密码错误' });
        }

        // 登录成功
        res.status(200).json({ code: 20000, message: '登录成功', user: { stuId: user.stuId, email: user.email } });
    });
});

// 导出路由
module.exports = router;