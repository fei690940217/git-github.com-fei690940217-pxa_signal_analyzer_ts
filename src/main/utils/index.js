/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:27:10
 * @FilePath: \pxa_signal_analyzer\src\main\utils\index.js
 * @Description:utils
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { pinpuConnectionName } from '@src/common';

const { BrowserWindow } = require('electron');
const { electronStore } = require('../publicData');
const { create_instr_fn } = require('../api/api');
const { getWindow } = require('../windowManager');
//获取WebContents
exports.getWebContents = () => {
  const browserList = BrowserWindow.getAllWindows();
  if (browserList?.length) {
    return browserList[0].webContents;
  }
};
//主进程给渲染进程发送消息,key,value形式
exports.mainSendRender = (key, value) => {
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  //通知测试进程开始测试
  webContents.send(key, value);
};
//obj ={key:'addLog',value:'xxx'}
exports.dispatchAction = (obj) => {
  //找到主进程
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  //通知测试进程开始测试
  webContents.send('dispatchAction', obj);
};
exports.stuckProcess = () => {
  sleep();
};
// exports.delayTime = (ms) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, ms);
//   });
// };
exports.delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
exports.numHandle = (num) => {
  return parseFloat(Number(num).toFixed(2));
};
exports.generateCellAddress = (row, column) => {
  return new Promise((resolve, reject) => {
    if (
      typeof row !== 'number' ||
      typeof column !== 'number' ||
      row < 0 ||
      column < 0
    ) {
      reject(new Error('Invalid row or column number'));
    }
    row++; // 从0开始的坐标转换为从1开始
    column++;
    let columnAddress = '';
    let tempColumn = column;

    while (tempColumn > 0) {
      const remainder = (tempColumn - 1) % 26;
      columnAddress = String.fromCharCode(65 + remainder) + columnAddress;
      tempColumn = Math.floor((tempColumn - 1) / 26);
    }

    resolve(columnAddress + row);
  });
};

//连接频谱连接
exports.createSpectrumConnection = (ip) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        instructName: '创建频谱连接',
        instr_name: pinpuConnectionName,
        mode: 'ip',
        ip,
      };
      await create_instr_fn(params);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.resolveHtmlPath = (htmlFileName) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
};
