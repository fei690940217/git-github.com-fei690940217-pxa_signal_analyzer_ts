/*
 * @File Path: \fcc_5g_test_system_only_spectrum\src\utils\index.js
 * @Author: xxx
 * @Date: 2023-03-14 15:46:45
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:24:52
 * @Descripttion:
 */
const { ipcRenderer } = window.myApi;
//通知main进程,添加日志
//payload {level:'error | warn | info',msg:'日志内容'}
type LogPayload = {
  level: 'error' | 'warn' | 'info';
  msg: string;
};
export const addLogRendererToMain = (payload: LogPayload) => {
  ipcRenderer.send('addLogRendererToMain', payload);
};
//等待函数
export const delayTime = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
