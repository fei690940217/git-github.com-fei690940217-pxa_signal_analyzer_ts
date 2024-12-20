/*
 * @Author: feifei
 * @Date: 2023-05-24 10:00:07
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:58:57
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\index.js
 * @Description: 测试专用子进程
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import SharedParameters from './globals';
import { addLogFn, childSendMainMessage } from './utils';
import { logError, logInfo } from './utils/logLevel';

import { appConfigFilePath } from '../main/publicData';
import electronStore from '@src/main/electronStore';
import path from 'path';
import logger from './logger';
import { transports } from 'winston';

const modifyLogConfig = (
  parentProjectName,
  subProjectName,
  currentSelectedItem,
) => {
  //注入日志函数
  const logFilePath = path.join(
    appConfigFilePath,
    'user',
    'project',
    parentProjectName,
    subProjectName,
    'project.log',
  );

  logger.configure({
    transports: [
      new transports.File({
        filename: logFilePath, // 存储文件路径
      }),
    ],
  });
  logInfo('测试子进程已启动,准备开始测试');
  logInfo(
    `测试条目:${parentProjectName}/${subProjectName}/${currentSelectedItem.id}`,
  );
};
//全局参数注入
const paramsInject = (TestParams) => {
  //注入全局参数
  const { currentSelectedItem, parentProjectName, subProjectName } = TestParams;
  SharedParameters.set('projectName', parentProjectName);
  SharedParameters.set('subProjectName', subProjectName);
  SharedParameters.set('currentSelectedItem', currentSelectedItem);
  //频谱线损
  const spectrumLineLoss = electronStore.get('spectrumLineLoss');
  SharedParameters.set('spectrumLineLoss', spectrumLineLoss);
  //频谱配置
  const spectrumConfig = electronStore.get('spectrumConfig');
  SharedParameters.set('spectrumConfig', spectrumConfig);
  //注入日志
  modifyLogConfig(parentProjectName, subProjectName, currentSelectedItem);
};
try {
  //清空全局数据
  SharedParameters.clear();
  const { timeoutTest } = require('./utils');
  const TEST_FN = require('./testIndex');
  //    全测/单条
  // const allTest = require("./allTest");
  //已进入进程就直接开始测试
  const argv = process.argv;
  const findItem = argv.find((item) => {
    return item.includes('parentProjectName');
  });
  //测试所需的参数
  const TestParams = JSON.parse(findItem);
  paramsInject(TestParams);
  //主测试函数
  TEST_FN(TestParams);
  //事件监听
  process.parentPort.on('message', (e) => {
    const { messageType } = e.data;
    //接到通知>>>>调用暂停函数
    if (messageType === 'timeoutTest') {
      timeoutTest();
    }
  });
} catch (error) {
  logError(String(error));
  const log = `error_-_${String(error)}`;
  addLogFn(log);
  //通知main > kill子进程
  childSendMainMessage('processExit', { status: 'error' });
}
