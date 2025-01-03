/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 17:55:57
 * @FilePath: \pxa_signal_analyzer\src\main\addWindowManager.ts
 * @Description:创建项目专用的窗口,模态窗口
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, screen, nativeImage } from 'electron';
//运行环境
import path from 'path';
import { resolveHtmlPath } from './utils';
import { getWindow } from './windowManager';
// windowManager.js
let childWindow: BrowserWindow | null = null;

type OpenTheProjectWindowPayload = {
  projectName: string;
  subProjectName?: string;
};
export const createAddWindow = (payload: OpenTheProjectWindowPayload) => {
  const { projectName, subProjectName } = payload;
  const topWindow = getWindow();
  if (!topWindow) {
    return;
  }
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const intWidth = Math.floor(width * 0.85);
  const intHeight = Math.floor(height * 0.85);
  childWindow = new BrowserWindow({
    width: intWidth,
    height: intHeight,
    parent: topWindow,
    modal: true,
    show: false,
    backgroundColor: '#f5f5f5',
    center: true,
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true, // 开启上下文隔离
    },
    frame: false, //去掉边框
  });
  //去掉菜单栏
  // childWindow.setMenuBarVisibility(false);
  // 使用 URL 查询字符串传递参数
  const params = `?projectName=${projectName}&subProjectName=${subProjectName}`;
  //加载addPage
  const htmlUrl = resolveHtmlPath('renderer1.html');
  const url = `${htmlUrl}${params}`;
  console.log(url);
  childWindow.loadURL(url);
  childWindow.once('ready-to-show', () => {
    childWindow?.show();
  });
};

export const getAddWindow = () => childWindow;
export const resetAddWindow = () => {
  childWindow = null;
};
