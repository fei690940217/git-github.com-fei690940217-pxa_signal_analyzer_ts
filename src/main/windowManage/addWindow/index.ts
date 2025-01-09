/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 09:24:39
 * @FilePath: \pxa_signal_analyzer\src\main\windowManage\addWindow\index.ts
 * @Description:创建项目专用的窗口,模态窗口
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, screen, nativeImage } from 'electron';
//运行环境
import path from 'path';
import { resolveHtmlPath } from '@src/main/utils';
import { getWindow } from '@src/main/windowManage/mainWindow';
import { contextTemplate } from './MenuList';
import allPath from '@root/.erb/configs/webpack.paths';
import {
  AddDirType,
  OpenTheProjectWindowPayload,
} from '@src/customTypes/index';
const { rootPath } = allPath;
// windowManager.js
let childWindow: BrowserWindow | null = null;
export const createAddWindow = (payload: OpenTheProjectWindowPayload) => {
  const { dirName, subProjectName } = payload;
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
    show: true,
    backgroundColor: '#f5f5f5',
    center: true,
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(rootPath, '.erb/dll/preload.js'),
      contextIsolation: true, // 开启上下文隔离
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
  });
  //去掉菜单栏
  // childWindow.setMenuBarVisibility(false);
  // 使用 URL 查询字符串传递参数
  let params = `?dirName=${dirName}`;
  if (subProjectName) {
    params = `${params}&subProjectName=${subProjectName}`;
  }
  //加载addPage
  const htmlUrl = resolveHtmlPath('renderer1.html');
  const url = `${htmlUrl}${params}`;
  console.log(url);
  childWindow?.setTitleBarOverlay({
    color: '#001529', // 设置背景颜色为深灰色
    symbolColor: '#ffffff', // 设置符号颜色为白色
    height: 40, // 设置控制符区域的高度为40px
  });
  childWindow.loadURL(url);
  //背景透明度设置
  childWindow.setBackgroundMaterial('acrylic');
  //透明度
  // childWindow.setOpacity(0.9);
  //添加右键上下文菜单
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  childWindow.webContents.on('context-menu', (e, params) => {
    contextMenu.popup({ window: childWindow || undefined });
  });
  childWindow.once('ready-to-show', () => {
    // childWindow?.show();
  });
  childWindow.on('close', () => {
    console.log('addWindow closed');
    childWindow = null;
  });
};

export const getAddWindow = () => childWindow;
export const resetAddWindow = () => {
  childWindow = null;
};
