/*
 * @Author: feifei
 * @Date: 2024-12-17 09:44:49
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 09:45:04
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\logger\logLevel.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const logger = require('./index')


exports.logInfo = (msg) => {
    console.log(msg)
    logger.info(msg)
}

exports.logError = (msg) => {
    console.error(msg)
    logger.error(msg)
}