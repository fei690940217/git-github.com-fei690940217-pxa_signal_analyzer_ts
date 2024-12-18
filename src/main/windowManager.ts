/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:00:08
 * @FilePath: \pxa_signal_analyzer\src\main\windowManager.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, screen, nativeImage } from 'electron';
//运行环境
import path from 'path';
// windowManager.js
let win: BrowserWindow | null = null;

export const createWindow = () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');
  console.log('RESOURCES_PATH', RESOURCES_PATH);
  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const intWidth = Math.floor(width * 0.9);
  const intHeight = Math.floor(height * 0.9);
  win = new BrowserWindow({
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
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true, // 开启上下文隔离
    },
  });
};

export const getWindow = () => win;
export const setWindow = (win: BrowserWindow | null) => {
  win = win;
};
