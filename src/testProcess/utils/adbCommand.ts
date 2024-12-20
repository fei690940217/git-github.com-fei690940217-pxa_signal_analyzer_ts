/*
 * @Author: feifei
 * @Date: 2023-07-19 15:01:01
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:20:22
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\adbCommand.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { exec } from 'child_process';
import { delayTime, addLogFn, childSendMainMessage } from './index';
import { logError, logInfo } from './logLevel';

// 封装一个 Promise 化的 exec 方法
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
const rootCommand = 'adb root';
const openAirplaneModeCommand =
  'adb shell settings put global airplane_mode_on 1';
const openBroadcast = `adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state 1`;
const closeAirplaneModeCommand =
  'adb shell settings put global airplane_mode_on 0';
const closeBroadcast = `adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state 0`;

const rootFn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await executeCommand(rootCommand);
      resolve();
    } catch (error) {
      logError(`root命令出错:${String(error)}`);
      resolve('root命令出错:' + String(error));
    }
  });
};

//打开飞行模式
const openFn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //打开飞行模式
      await executeCommand(openAirplaneModeCommand);
      resolve();
    } catch (error) {
      reject('打开飞行命令出错:' + error);
    }
  });
};
const openBroadcastFn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //广播一下,通知手机响应飞行模式
      await executeCommand(openBroadcast);
      resolve();
    } catch (error) {
      reject('打开飞行广播出错:' + String(error));
    }
  });
};
const closeBroadcastFn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //广播一下,通知手机响应飞行模式
      await executeCommand(closeBroadcast);
      resolve();
    } catch (error) {
      reject('关闭飞行广播出错:' + String(error));
    }
  });
};
const closeFn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await executeCommand(closeAirplaneModeCommand);
      resolve();
    } catch (error) {
      reject('关闭飞行命令出错' + error);
    }
  });
};
//递归函数
export default async () => {
  try {
    const log = `success_-_样机开始飞行`;
    addLogFn(log);
    //初始化
    await rootFn();
    //等待
    await delayTime(1000);
    //打开飞行模式
    await openFn();
    //广播一下
    await openBroadcastFn();
    //等待
    await delayTime(1000);
    //关闭飞行模式
    await closeFn();
    //关闭广播
    await closeBroadcastFn();
    addLogFn(`success_-_飞行成功`);
    return Promise.resolve();
  } catch (error) {
    logError(`adb命令出错:${String(error)}`);
    const log = `error_-_${String(error)}`;
    addLogFn(log);
    const log1 = `error_-_未找到样机,请检查样机是否连接,或者手动飞行`;
    addLogFn(log1);
    //参数type, value  通知渲染进程提示用户
    childSendMainMessage('showMessage', {
      type: 'error',
      content: '未找到样机,请检查样机是否连接,或者手动飞行',
    });
    return Promise.resolve();
  }
};
