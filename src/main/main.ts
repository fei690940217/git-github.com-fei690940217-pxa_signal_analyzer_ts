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

import { app, shell, ipcMain, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './utils';
import appEventHandle from './appEventHandle';
import { createWindow, getWindow, setWindow } from './windowManager';
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
//创建窗口函数
const createWindowFn = () => {
  createWindow();
  const mainWindow = getWindow();
  if (!mainWindow) return;
  //zui
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.minimize();
      mainWindow.show();
    }
  });
  const htmlUrl = resolveHtmlPath('index.html');
  mainWindow.loadURL(htmlUrl);
  appEventHandle(mainWindow);
  mainWindow.on('closed', () => {
    //后边加一下重置逻辑，重置窗口
    setWindow(null);
  });
  //确保了在应用中点击链接时会在默认浏览器中打开
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  //处理了渲染进程不响应的情况，提供了一些日志和潜在的处理机制。
  mainWindow.on('unresponsive', (error: any) => {
    console.error('The renderer process has become unresponsive!', error);
    // 在这里执行适当的处理
  });
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

app
  .whenReady()
  .then(async () => {
    Menu.setApplicationMenu(null);
    createWindowFn();
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
