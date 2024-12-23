/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-12-20 13:39:00
 * @LastEditors: feifei
 * @Description: In User Settings Edit
 * @FilePath: \pxa_signal_analyzer\src\main\api\request.ts
 */

import dispatchAction from '@src/main/utils/dispatchAction';

import axios from 'axios';
import baseURL from '../publicData/baseURL';
// 创建axios实例
const createInstance = () => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
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
// 添加响应拦截器
instance.interceptors.response.use(
  //请求成功
  function (res) {
    const url = res.config.url;
    if (res.data.error === 0) {
      //查询或者写入
      if (url === '/write' || url === '/query') {
        const tempData = JSON.parse(res.config.data);
        const { command, instructName } = tempData;
        const log = `${instructName} ${url} ${command} ${res.data.rst}`;
        dispatchAction({ key: 'addLog', value: log });
      } else {
        const log = `${url} ${res.data?.rst ? res.data.rst : ''}`;
        dispatchAction({ key: 'addLog', value: log });
      }
    } else {
      let command = '';
      let instructName = '';
      //查询或者写入
      if (url === '/write' || url === '/query') {
        const tempData = JSON.parse(res.config.data);
        command = tempData.command;
        instructName = tempData.instructName;
      }
      const log = `error_-_${instructName} ${url} ${command} ${res.data.errmsg}`;
      dispatchAction({ key: 'addLog', value: log });
    }
    return res;
  },
  //响应错误处理
  function (error) {
    return Promise.reject(error.config.url + ' ' + error.message);
  },
);

export default instance;
