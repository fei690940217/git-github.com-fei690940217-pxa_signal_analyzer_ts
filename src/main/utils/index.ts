/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-31 15:33:13
 * @FilePath: \pxa_signal_analyzer\src\main\utils\index.ts
 * @Description:utils
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { pinpuConnectionName } from '@src/common';
import { getWindow } from '@src/main/windowManager';
import path from 'path';
import { create_instr_fn } from '../api/api';
//主进程给渲染进程发送消息,key,value形式
export const mainSendRender = (key: string, value: any = '') => {
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  if (webContents) {
    //通知测试进程开始测试
    webContents.send(key, value);
  }
};
type DispatchActionType = { key: string; value: any };
export const dispatchAction = (obj: DispatchActionType) => {
  //找到主进程
  //找到主进程
  const win = getWindow();
  const webContents = win?.webContents;
  if (webContents) {
    //通知测试进程开始测试
    webContents.send('dispatchAction', obj);
  }
};
export const delayTime = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

//连接频谱连接

export const resolveHtmlPath = (htmlFileName: string) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
};

//连接频谱连接
export const createSpectrumConnection = (ip: string) => {
  return new Promise<void>(async (resolve, reject) => {
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
