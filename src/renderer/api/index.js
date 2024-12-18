/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-12-11 11:44:20
 * @LastEditors: feifei
 * @Description: In User Settings Edit
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\api\index.js
 */

import axios from "axios";
const { electronStore, baseURL: mainBaseUrl } = window.myApi;
let baseURL = "";
//开发环境
if (process.env.NODE_ENV === "development") {
  //手动切换
  baseURL = mainBaseUrl;
}
//生产环境必须是
else {
  baseURL = `http://127.0.0.1:${electronStore.get("visaProxyPort")}`;
}
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
  }
);
// 添加响应拦截器
instance.interceptors.response.use(
  //请求成功
  function (res) {
    return res;
  },
  //响应错误处理
  function (error) {
    const originalRequest = error.config;
    //重新请求的条件
    const flag =
      (error.code == "ERR_NETWORK" || error.message.includes("Network")) &&
      !originalRequest._retry &&
      originalRequest.url === "/check_auth";
    if (flag) {
      originalRequest._retry = true;
      return instance.request(originalRequest);
    } else {
      return Promise.reject(error);
    }
  }
);


// 当获取到新的端口号时更新 baseURL
const updateBaseUrl = () => {
  const port = electronStore.get("visaProxyPort");
  if (port) {
    const dynamicBaseUrl = `http://127.0.0.1:${port}`;
    instance.defaults.baseURL = dynamicBaseUrl;
  }
};


export default instance;
