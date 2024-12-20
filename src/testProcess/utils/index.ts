/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:43:56
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\index.ts
 * @Description: 测试模块的utils函数
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import logger from '@src/testProcess/logger';
import electronStore from '@src/main/electronStore';

//测试子进程发送消息给主进程
export const childSendMainMessage = (type: string, value: any) => {
  if (type === 'showMessage') {
    if (electronStore.get('mainWindowIsShow')) {
      return;
    }
  }
  process.parentPort.postMessage({ type, value });
};
//单独封装addLogFn
export const addLogFn = (message: string) => {
  //返回给前端展示
  childSendMainMessage('dispatchAction', {
    key: 'addLog',
    value: message,
  });
  //本地存储
  let level: 'info' | 'error' = 'info';
  if (message?.includes('error')) {
    level = 'error';
  }
  logger[level](message);
};
//卡死进程,类似Python sleep
const sleep = (ms: number) => {
  const nil = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(nil, 0, 0, Number(ms));
};
//暂停测试
export const timeoutTest = () => {
  let flag = true;
  if (electronStore.get('isTimeout')) {
    const log = `warning_-_暂停`;
    addLogFn(log);
  }
  while (flag) {
    //暂停中>卡住函数不返回
    if (electronStore.get('isTimeout')) {
      //等待200ms
      sleep(2000);
      if (!electronStore.get('isTimeout')) {
        const log = `warning_-_继续`;
        addLogFn(log);
        return;
      }
    } else {
      return;
    }
  }
};

export const delayTime = (ms: number) => {
  return new Promise((resolve, reject) => {
    addLogFn(`warning_-_等待${ms}ms`);
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
//等待函数
export const waitFn = async () => {
  if (electronStore.get('isTimeout')) {
    const log = `warning_-_暂停`;
    addLogFn(log);
  }
  while (true) {
    //暂停中>卡住函数不返回
    if (electronStore.get('isTimeout')) {
      //等待200ms
      await delayTime(500);
      if (!electronStore.get('isTimeout')) {
        const log = `warning_-_继续`;
        addLogFn(log);
        return;
      }
    } else {
      return;
    }
  }
};
