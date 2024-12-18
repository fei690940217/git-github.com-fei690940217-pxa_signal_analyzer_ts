/*
 * @Author: feifei
 * @Date: 2023-07-16 22:32:05
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 14:01:18
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\publicData\baseURL.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */

const { electronStore } = require("./index.js");
const devUrl = `http://127.0.0.1:7001`;
// const devUrl = `http://127.0.0.1:${electronStore.get("visaProxyPort")}`;
const port = electronStore.get("visaProxyPort") || 10086
const prodUrl = `http://127.0.0.1:${port}`;
const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev ? devUrl : prodUrl
module.exports = baseURL