/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:27:20
 * @FilePath: \pxa_signal_analyzer\src\main\utils\index.ts
 * @Description:utils
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { pinpuConnectionName } from '@src/common';
import { BrowserWindow } from 'electron';
import { create_instr_fn } from '@src/main/api/api';
import { getWindow } from '@src/main/windowManager';
//获取WebContents
export const getWebContents = () => {
  const browserList = BrowserWindow.getAllWindows();
  if (browserList?.length) {
    return browserList[0].webContents;
  }
};
//主进程给渲染进程发送消息,key,value形式
export const mainSendRender = (key, value) => {
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  //通知测试进程开始测试
  webContents.send(key, value);
};
//obj ={key:'addLog',value:'xxx'}
export const dispatchAction = (obj) => {
  //找到主进程
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  //通知测试进程开始测试
  webContents.send('dispatchAction', obj);
};
export const stuckProcess = () => {
  sleep();
};
// export const  delayTime = (ms) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, ms);
//   });
// };
export const delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
export const numHandle = (num) => {
  return parseFloat(Number(num).toFixed(2));
};
export const generateCellAddress = (row, column) => {
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
export const createSpectrumConnection = (ip) => {
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

export const resolveHtmlPath = (htmlFileName) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
};
