/*
 * @Author: feifei
 * @Date: 2024-12-13 16:25:32
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-13 17:37:59
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\logger\index.js
 * @Description: 日志模块
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;
const { appConfigFilePath } = require('../publicData')
const path = require('path');
const fs = require('fs');
const logPath = path.join(appConfigFilePath, 'app', 'logs');
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

// 创建 Winston 日志实例
const logger = createLogger({
    level: 'info',// 日志级别
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),// 自动添加时间戳
        json()
    ),
    transports: [
        new transports.File({
            filename: `${logPath}/app.log`,        // 存储文件路径
            maxsize: 5 * 1024 * 1024,        // 设置文件大小限制 (5MB)
            maxFiles: 2,                     // 设置最大文件数量
            tailable: true
        })
    ],
});


module.exports = logger