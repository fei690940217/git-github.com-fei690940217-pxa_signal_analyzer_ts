/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-12-10 10:37:38
 * @LastEditors: feifei
 * @Description: 创建连接专用的request
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\api\createConnectRequest.js
 */

const axios = require("axios");
const baseURL = require("../../main/publicData/baseURL");

const delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
//单独封装addLogFn
const addLogFn = (message) => {
  process.parentPort.postMessage({
    type: "dispatchAction",
    value: {
      key: "addLog",
      value: message,
    },
  });
};
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

module.exports = instance;
