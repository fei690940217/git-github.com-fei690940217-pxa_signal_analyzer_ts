/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 11:04:53
 * @FilePath: \pxa_signal_analyzer\src\main\appEventHandle\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { app, Menu, BrowserView } from 'electron';
import { contextTemplate } from './AppMenuList';
import windowClose from './windowClose';
import configValidate from '../configValidate';
import ipcMainEvent from '../ipcMain/index';
import runVisaProxy from '../utils/runVisaProxy';
import electronStore from '@src/main/electronStore';
//子进程启动函数
export default (win: BrowserView) => {
  //app事件监听函数
  app.on('window-all-closed', async (event) => {
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
  //监听ipcMain事件
  ipcMainEvent();
  //启动PythonVisa代理
  runVisaProxy();
  //添加右键上下文菜单
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  win.webContents.on('context-menu', (e, params) => {
    contextMenu.popup(win, params.x, params.y);
  });
  //验证配置文件
  win.on('ready-to-show', () => {
    configValidate(win);
  });

  // 监听窗口最小化事件
  win.on('minimize', () => {
    // 在这里可以执行您的逻辑
    electronStore.set('mainWindowIsShow', true);
  });

  // 监听窗口恢复事件（从最小化状态恢复）
  win.on('restore', () => {
    // 在这里可以执行您的逻辑
    electronStore.set('mainWindowIsShow', false);
  });
};
