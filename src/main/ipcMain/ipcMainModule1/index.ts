/*
 * @Author: feifei
 * @Date: 2025-01-08 15:37:37
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 15:40:51
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 13:17:51
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\index.ts
 * @Description: 监听渲染进程事件
 *
 */
import path from 'path';
import { ipcMain } from 'electron';
import { readJson } from 'fs-extra';
import { appConfigFilePath } from '@src/main/publicData';
import createProject from './createProject';
import archiveProject from './archiveProject';
import deleteProject from './deleteProject';
import getProjectInfo from './getProjectInfo';
import openDir from './openDir';
type ipcMainMod1OnType = {
  action: string;
  payload: any;
};
type ipcMainMod1HandleType = {
  action: string;
  payload: any;
};

const jsonFileRoutes: Record<string, Function> = {
  getProjectInfo,
  createProject,
  archiveProject,
  deleteProject,
  openDir,
};

export default () => {
  //验证配置文件>config文件夹,用户定义
  ipcMain.on('ipcMainMod1On', (e, params: ipcMainMod1OnType) => {
    try {
      console.log('检测到ipcMainMod1On事件触发', params);
      const { action, payload } = params;
      const handler = jsonFileRoutes[action];
      if (handler) {
        return handler(payload);
      }
    } catch (error) {
      console.error(error);
    }
  });

  //移动文件夹
  ipcMain.handle('ipcMainMod1Handle', (e, params: ipcMainMod1HandleType) => {
    try {
      console.log('检测到ipcMainMod1Handle事件触发', params);
      const { action, payload } = params;
      const handler = jsonFileRoutes[action];
      if (handler) {
        return handler(payload);
      }
    } catch (error) {
      console.error(error);
    }
  });
};
