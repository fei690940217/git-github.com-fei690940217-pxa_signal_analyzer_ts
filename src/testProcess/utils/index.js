/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:35:17
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\utils\index.js
 * @Description: 测试模块的utils函数
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const { electronStore } = require("../../main/publicData");
const logger = require('../logger')

//测试子进程发送消息给主进程
const childSendMainMessage = (type, value) => {
  if (type === "showMessage") {
    if (electronStore.get("mainWindowIsShow")) {
      return;
    }
  }
  process.parentPort.postMessage({ type, value });
};
//单独封装addLogFn
const addLogFn = (message) => {
  //返回给前端展示
  childSendMainMessage("dispatchAction", {
    key: "addLog",
    value: message,
  });
  //本地存储
  let level = 'info'
  if (message?.includes('error')) {
    level = 'error'
  }
  logger[level](message)
};
//卡死进程,类似Python sleep
const sleep = (ms) => {
  const nil = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(nil, 0, 0, Number(ms));
};
//暂停测试
exports.timeoutTest = () => {
  let flag = true;
  if (electronStore.get("isTimeout")) {
    const log = `warning_-_暂停`;
    addLogFn(log);
  }
  while (flag) {
    //暂停中>卡住函数不返回
    if (electronStore.get("isTimeout")) {
      //等待200ms
      sleep(2000);
      if (!electronStore.get("isTimeout")) {
        const log = `warning_-_继续`;
        addLogFn(log);
        return;
      }
    } else {
      return;
    }
  }
};

exports.delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    addLogFn(`warning_-_等待${ms}ms`);
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
//等待函数
exports.waitFn = async () => {
  if (electronStore.get("isTimeout")) {
    const log = `warning_-_暂停`;
    addLogFn(log);
  }
  while (true) {
    //暂停中>卡住函数不返回
    if (electronStore.get("isTimeout")) {
      //等待200ms
      await exports.delayTime(500);
      if (!electronStore.get("isTimeout")) {
        const log = `warning_-_继续`;
        addLogFn(log);
        return;
      }
    } else {
      return;
    }
  }
};

//添加log
exports.addLogFn = addLogFn;
//渲染进程接收的函数形式
//测试进程通知main进程
exports.childSendMainMessage = childSendMainMessage;


