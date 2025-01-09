/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 09:17:37
 * @FilePath: \pxa_signal_analyzer\src\main\windowManage\mainWindow\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, screen, nativeImage, shell } from 'electron';
//运行环境
import path from 'path';
import { contextTemplate } from './MenuList';
import allPath from '@root/.erb/configs/webpack.paths';
import { resolveHtmlPath } from '@src/main/utils';
import electronStore from '@src/main/electronStore';
import configValidate from '@src/main/configValidate';
const { rootPath } = allPath;
// windowManager.js
let mainWindow: BrowserWindow | null = null;

export const createWindow = () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(rootPath, 'assets');
  console.log('RESOURCES_PATH', RESOURCES_PATH);
  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const intWidth = Math.floor(width * 0.9);
  const intHeight = Math.floor(height * 0.9);
  mainWindow = new BrowserWindow({
    width: intWidth,
    height: intHeight,
    show: false,
    title: 'fcc_5g_test_electron',
    icon: getAssetPath('icon.ico'),
    backgroundColor: '#ccc',
    center: true,
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(rootPath, '.erb/dll/preload.js'),
      contextIsolation: true, // 开启上下文隔离
    },
  });
  const htmlUrl = resolveHtmlPath('index.html');
  console.log(htmlUrl);
  mainWindow.loadURL(htmlUrl);
  //添加右键上下文菜单
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  mainWindow.webContents.on('context-menu', (e, params) => {
    contextMenu.popup({ window: mainWindow || undefined });
  });
  //添加事件
  mainWindow.on('closed', () => {
    //后边加一下重置逻辑，重置窗口
    mainWindow = null;
  });
  //确保了在应用中点击链接时会在默认浏览器中打开
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  //ready-to-show
  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    //验证配置文件
    configValidate();
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.minimize();
      mainWindow.show();
    }
    //mainWindow启动之后3S,准备启动addWindow
  });
  // 监听窗口最小化事件
  mainWindow.on('minimize', () => {
    // 在这里可以执行您的逻辑
    electronStore.set('mainWindowIsShow', true);
  });

  // 监听窗口恢复事件（从最小化状态恢复）
  mainWindow.on('restore', () => {
    // 在这里可以执行您的逻辑
    electronStore.set('mainWindowIsShow', false);
  });
};

export const getWindow = () => mainWindow;
export const setWindow = (mainWindow: BrowserWindow | null) => {
  mainWindow = mainWindow;
};
