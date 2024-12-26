/*
 * @Author: your name
 * @Date: 2021-07-01 01:24:00
 * @LastEditTime: 2024-12-23 10:03:11
 * @LastEditors: feifei
 * @Description: In User Settings Edit
 * @FilePath: \pxa_signal_analyzer\src\testProcess\api\request.ts
 */

import { addLogFn } from '../utils';
import responseErrorHandle from './errorHandle';
import axios from 'axios';
import {
  type AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInterceptorManager,
  Method,
  ResponseType,
  responseEncoding,
} from 'axios';
import baseURL from '@src/main/publicData/baseURL';
import { logInfo, logError } from '../utils/logLevel';

// 创建axios实例
const createInstance = () => {
  const instance = axios.create({
    baseURL,
    timeout: 8000,
  });
  return instance;
};
const instance: AxiosInstance = createInstance();
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
const responseSuccess = async (res: AxiosResponse): Promise<AxiosResponse> => {
  try {
    const originalRequest = res.config;
    //以下为返回值
    const responseData = res.data;
    //以下为请求参数
    const url = originalRequest.url;
    const jsonData = JSON.parse(originalRequest.data);
    //以下为处理逻辑

    //指令
    const command = jsonData.command || '';
    //请求说明
    let instructName = jsonData.instructName || '';

    //查询结果,只有查询指令才有
    const RST = responseData?.rst || '';
    if (responseData.error === 0) {
      const log = `${instructName} ${url} ${command} <strong style="color:green">${RST}</strong>`;
      addLogFn(log);
      return Promise.resolve(res);
    } else {
      addLogFn(`error_-_${instructName} ${url} ${command} ${res.data?.errmsg}`);
      return responseErrorHandle(originalRequest, instance);
    }
  } catch (error) {
    logError(error?.toString() || 'responseSuccess函数内发生错误 67');
    return Promise.resolve(res);
  }
};
const responseError = async (error: any) => {
  logError(error.toString());
  try {
    const { message, config } = error.toJSON();
    const { url, data } = config;
    const jsonData = JSON.parse(data);
    const { instructName, command, instr_name } = jsonData;
    const logText = `error_-_${instructName || ''} ${instr_name || ''} ${url} ${
      command || ''
    } 请求出错 ${message}`;
    addLogFn(logText);
    return responseErrorHandle(config, instance);
  } catch (error) {
    return Promise.reject(error);
  }
};
// 添加响应拦截器
instance.interceptors.response.use(responseSuccess, responseError);

export default instance;
