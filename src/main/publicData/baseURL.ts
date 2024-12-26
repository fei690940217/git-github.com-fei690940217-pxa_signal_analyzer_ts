/*
 * @Author: feifei
 * @Date: 2023-07-16 22:32:05
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 10:14:04
 * @FilePath: \pxa_signal_analyzer\src\main\publicData\baseURL.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import electronStore from '@src/main/electronStore';
const devUrl = `http://127.0.0.1:7001`;
// const devUrl = `http://127.0.0.1:${electronStore.get("visaProxyPort")}`;
const port = electronStore.get('visaProxyPort') || 10086;
const prodUrl = `http://127.0.0.1:${port}`;
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? devUrl : prodUrl;
export default baseURL;
