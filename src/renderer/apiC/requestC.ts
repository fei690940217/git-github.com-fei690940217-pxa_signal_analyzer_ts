/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-02-06 13:43:08
 * @LastEditors: feifei
 * @Description: In User Settings Edit
 * @FilePath: \5G_TELEC_TEST\src\renderer\apiC\requestC.ts
 */

import axios from 'axios';
const { baseURL } = window.myApi;

// 创建axios实例
const createInstance = () => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });
  return instance;
};
const instance = createInstance();
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    if (config.data) {
      const params = config.data;
      if (params.httpTimeout) {
        config.timeout = params.httpTimeout;
      }
    }
    return config;
  },
  // 对请求错误做些什么
  function (error) {
    return Promise.reject(error);
  },
);
// 添加响应拦截器
instance.interceptors.response.use(
  //请求成功
  function (res) {
    return res;
  },
  //响应错误处理
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
