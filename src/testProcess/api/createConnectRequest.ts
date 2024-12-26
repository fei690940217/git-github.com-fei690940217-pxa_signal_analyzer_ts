/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-12-20 14:28:26
 * @LastEditors: feifei
 * @Description: 创建连接专用的request
 * @FilePath: \pxa_signal_analyzer\src\testProcess\api\createConnectRequest.ts
 */

import axios from 'axios';
import baseURL from '@src/main/publicData/baseURL';

// 创建axios实例
const createInstance = () => {
  const instance = axios.create({
    baseURL,
    timeout: 8000,
  });
  return instance;
};
const instance = createInstance();
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  // 对请求错误做些什么
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
