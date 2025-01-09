/*
 * @Author: feifei
 * @Date: 2024-12-17 14:48:07
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 16:25:24
 * @FilePath: \pxa_signal_analyzer\src\main\main.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
//路径别名设置
import moduleAlias from 'module-alias';
// 设置模块别名映射;
moduleAlias.addAlias('@main', __dirname); // 替换成实际的主进程文件夹路径
moduleAlias.addAlias('@render', __dirname + '/../render'); // 替换成实际的渲染进程文件夹路径
moduleAlias.addAlias('@testProcess', __dirname + '/../testProcess');
moduleAlias.addAlias('@src', __dirname + '/../');
moduleAlias.addAlias('@root', __dirname + '/');

import { app, shell, ipcMain, Menu, ipcRenderer } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './utils';
import appEventHandle from './appEventHandle';
import { createWindow, getWindow, setWindow } from './windowManage/mainWindow';
console.log(ipcRenderer);
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

if (!app.hasSingleInstanceLock()) {
  app.requestSingleInstanceLock();
}
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  console.log('主进程退出');
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    Menu.setApplicationMenu(null);
    createWindow();
    //添加app相关的事件处理函数
    appEventHandle();
    if (isDebug) {
      installExtensions();
    }
  })
  .catch((error) => {
    console.error(error);
  });

app.on('render-process-gone', (error) => {
  console.error('The app has crashed!', error);
  // 在这里执行适当的处理，如重启应用
});
