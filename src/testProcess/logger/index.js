/*
 * @Author: feifei
 * @Date: 2024-12-13 16:25:32
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:05:05
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\logger\index.js
 * @Description: 日志模块
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

// 创建 Winston 日志实例
const logger = createLogger({
    level: 'info',// 日志级别
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),// 自动添加时间戳
        json()
    ),
    transports: [
        new transports.File({
            filename: `project.log`,        // 存储文件路径
        })
    ],
});


module.exports = logger