/*
 * @Author: feifei
 * @Date: 2023-05-24 14:27:38
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:17:54
 * @FilePath: \pxa_signal_analyzer\src\main\publicData\index.js
 * @Description: 公用数据
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const path = require('path');
const electronStore = require('./electron-store');

//electronStore
exports.electronStore = electronStore;
//配置文件路径
exports.appConfigFilePath = path.join(
  'D:',
  'fcc_5g_test_electron_only_spectrum',
);
//基站连接名称
exports.jizhanConnectionName = 'jizhanConnection';
//lineLoss连接名称
exports.lineLossConnectionName = 'lineLossConnection';

exports.visaProxyFileName = 'visa_proxy_only_spectrum.exe';
exports.defaultPort = 10086;
