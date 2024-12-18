/*
 * @Author: feifei
 * @Date: 2024-12-09 17:16:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 14:52:08
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\testProcess\TestProcessSingleton.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const { utilityProcess } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const dispatchAction = require('../../utils/dispatchAction.js');
const stopTest = require('./stopTest.js');
const { logError, logInfo } = require('../../logger/logLevel.js');
let testProcessInstance = null;

const messageHandlers = {
  dispatchAction,
  processExit: (value) => stopTest(value.status, testProcessInstance),
  showMessage: (value) => mainSendRender('showMessage', value),
};
class TestProcessSingleton {
  constructor(argv) {
    // 获取项目根目录
    const rootDir = process.cwd();
    const devPath = path.join(
      rootDir,
      'release',
      'app',
      'dist',
      'testProcess',
      'testProcess.js',
    );
    const prodPath = path.join(__dirname, '/../testProcess/testProcess.js');

    const filePath = isDev ? devPath : prodPath;
    this.childProcess = utilityProcess.fork(filePath, [argv]);
    // 设置监听事件等
    this.setupListeners();
  }
  //事件监听
  setupListeners() {
    //监听来自主进程的message事件
    this.childProcess.on('message', (data) => {
      const { type, value } = data;
      const handler = messageHandlers[type];
      if (handler) {
        handler(value);
      }
    });

    this.childProcess.on('spawn', () => {
      logInfo('TestProcessSingleton:子进程创建成功');
    });

    this.childProcess.on('exit', () => {
      logInfo('TestProcessSingleton:子进程已退出');
      if (testProcessInstance) {
        testProcessInstance = null;
      }
    });
  }

  // 添加其他可能需要的方法，例如发送消息给子进程等

  // 在需要时关闭子进程的方法
  closeChildProcess() {
    this.childProcess.kill();
    if (testProcessInstance) {
      testProcessInstance = null;
    }
  }
  // 发送消息给子进程的方法
  sendMessageToChildProcess(messageType, messageValue) {
    this.childProcess.postMessage({ messageType, messageValue });
  }
}

// 创建 TestProcess 实例
const createTestProcessInstance = (argv) => {
  // 确保只创建一个子进程实例
  testProcessInstance = new TestProcessSingleton(argv);
};

// 获取 TestProcess 实例
const getTestProcessInstance = () => {
  return testProcessInstance;
};
module.exports = {
  createTestProcessInstance,
  getTestProcessInstance,
};
