/*
 * @File Path: \fcc_5g_test_system_only_spectrum\src\utils\index.js
 * @Author: xxx
 * @Date: 2023-03-14 15:46:45
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 13:15:43
 * @Descripttion:
 */

//通知main进程,添加日志
//payload {level:'error | warn | info',msg:'日志内容'}
export const addLogRendererToMain = (payload) => {
  ipcRenderer.send('addLogRendererToMain', payload);
};
//等待函数
export const delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
