/*
 * @Author: feifei
 * @Date: 2024-12-09 09:18:06
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-02 14:01:22
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\getAndSetJsonFile.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import isDev from 'electron-is-dev';
import { app } from 'electron';
import {
  outputJson,
  readJson,
  readJsonSync,
  readdir,
  pathExists,
  pathExistsSync,
} from 'fs-extra';
import path from 'path';
import { appConfigFilePath } from '../publicData';
import { logError } from '../logger/logLevel';
import { AddDirType } from '@src/customTypes';
//getSubProjectList //获取本地项目文件夹内的文件列表,与本地文件夹内的文件列表进行比对
const getLocalProjectList = async () => {
  try {
    //子项目的根目录
    const folderPath = path.join(appConfigFilePath, 'user/project');
    const fileList = await readdir(folderPath);
    const RST: AddDirType[] = [];
    for (const item of fileList) {
      const fullPath = path.join(folderPath, item, 'dirInfo.json');
      const flag = await pathExists(fullPath);
      if (flag) {
        const dirInfo: AddDirType = await readJson(fullPath);
        RST.push(dirInfo);
      }
    }
    return Promise.resolve(RST);
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};
//设置项目列表
const setProjectList = async (params) => {
  try {
    const { result } = params;
    const projectListJsonFilePath = path.join(
      appConfigFilePath,
      'app',
      'projectList.json',
    );
    await outputJson(projectListJsonFilePath, result);
  } catch (error) {
    return Promise.reject(error);
  }
};
const getChangeLog = async () => {
  try {
    let filePath = '';
    //开发路径
    if (isDev) {
      filePath = path.join(__dirname, '..', '..', 'CHANGELOG.json');
    } else {
      filePath = path.join(app.getAppPath(), 'CHANGELOG.json');
    }
    const resultList = await readJson(filePath);
    return resultList;
  } catch (error) {
    return Promise.reject(error);
  }
};
const getCurrentResult = async (params) => {
  try {
    const { projectName, subProjectName } = params;
    const baseFile = path.join(
      appConfigFilePath,
      'user',
      'project',
      projectName,
    );
    let filePath = '';
    if (subProjectName) {
      filePath = path.join(baseFile, subProjectName, 'result.json');
    } else {
      filePath = path.join(baseFile, 'result.json');
    }
    const resultList = await readJson(filePath);
    return resultList;
  } catch (error) {
    const msg = `getCurrentResult 91 error: ${error?.message}`;
    logError(msg);
    return Promise.reject(error);
  }
};
const setCurrentResult = async (params) => {
  try {
    const { projectName, subProjectName, result } = params;
    const baseFile = path.join(
      appConfigFilePath,
      'user',
      'project',
      projectName,
    );
    let filePath = '';
    if (subProjectName) {
      filePath = path.join(baseFile, subProjectName, 'result.json');
    } else {
      filePath = path.join(baseFile, 'result.json');
    }
    await outputJson(filePath, result);
    return Promise.resolve();
  } catch (error) {
    const msg = `setCurrentResult 114 error: ${error?.message}`;
    logError(msg);
    return Promise.reject(error);
  }
};
export const getJsonFile = async (payload) => {
  try {
    const { type, params } = payload;
    //获取项目列表
    if (type === 'projectList') {
      return getLocalProjectList();
    }
    //获取版本记录
    else if (type === 'changeLog') {
      return getChangeLog();
    }

    //获取当前项目或者子项目的测试列表
    else if (type === 'currentResult') {
      return getCurrentResult(params);
    }
  } catch (error) {
    const msg = `getJsonFile 137 error: ${error?.message}`;
    logError(msg);
    return Promise.reject(error);
  }
};

export const setJsonFile = async (payload) => {
  try {
    const { type, params } = payload;
    //获取项目列表
    if (type === 'projectList') {
      return setProjectList(params);
    }
    //获取版本记录
    else if (type === 'changeLog') {
      return getChangeLog();
    }

    //获取当前项目或者子项目的测试列表
    else if (type === 'currentResult') {
      return setCurrentResult(params);
    }
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
