/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 11:35:07
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\index.ts
 * @Description: 监听渲染进程事件
 *
 */
import path from 'path';
import { ipcMain } from 'electron';
import { readJson } from 'fs-extra';
import { appConfigFilePath } from '@src/main/publicData';
import createProject from './createProject';
//子进程启动函数
//runVisaProxy
//用户主动结束测试
import { logError } from '@src/main/logger/logLevel';
type ipcMainMod1OnType = {
  action: string;
  payload: any;
};
type ipcMainMod1HandleType = {
  action: string;
  payload: any;
};
type getProjectInfoType = {
  dirName: string;
  subProjectName: string;
};
const getProjectInfo = async (params: getProjectInfoType) => {
  try {
    const { dirName, subProjectName } = params;
    const filePath = path.join(
      appConfigFilePath,
      'user',
      'project',
      dirName,
      subProjectName,
      'projectInfo.json',
    );
    const resultList = await readJson(filePath);
    return Promise.resolve(resultList);
  } catch (error) {
    const msg = `getProjectInfo 128 error: ${error?.toString()}`;
    logError(msg);
    return Promise.reject(msg);
  }
};
const jsonFileRoutes: Record<string, Function> = {
  getProjectInfo,
  createProject,
};

export default () => {
  //验证配置文件>config文件夹,用户定义
  ipcMain.on('ipcMainMod1On', (e, params: ipcMainMod1OnType) => {
    //强制刷新
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
