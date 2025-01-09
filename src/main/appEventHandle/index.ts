/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 14:55:33
 * @FilePath: \pxa_signal_analyzer\src\main\appEventHandle\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { app } from 'electron';
import ipcMainEvent from '../ipcMain/index';
import ipcMainModule1Event from '../ipcMain/ipcMainModule1';

import runVisaProxy from '../utils/runVisaProxy';
import electronStore from '@src/main/electronStore';
//子进程启动函数
export default () => {
  //app事件监听函数
  app.on('window-all-closed', async () => {
    //准备杀掉进程
    app.quit();
  });
  app.on('quit', () => {
    if (electronStore.get('isInProgress')) {
      electronStore.set('isInProgress', false);
    }
    if (electronStore.get('isTimeout')) {
      electronStore.set('isTimeout', false);
    }
  });
  //监听窗口关闭
  // windowClose(win);
  //监听ipcMain事件,分开注册,便于查找
  ipcMainEvent();
  ipcMainModule1Event();
  //启动PythonVisa代理
  runVisaProxy();
};
