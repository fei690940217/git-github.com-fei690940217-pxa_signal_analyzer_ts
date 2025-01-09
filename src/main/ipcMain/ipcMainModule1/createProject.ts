/*
 * @Author: feifei
 * @Date: 2025-01-09 11:37:47
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 13:08:10
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\createProject.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { CreateProjectPayload, ApiResponseType } from '@src/customTypes';
import { logError } from '@src/main/logger/logLevel';
import { appConfigFilePath } from '@src/main/publicData';
import {
  remove,
  move,
  pathExists,
  ensureDir,
  copy,
  readJson,
  outputJson,
  readdir,
  mkdir,
  readFile,
  rename,
} from 'fs-extra';
import path from 'path';

export default async (
  payload: CreateProjectPayload,
): Promise<ApiResponseType> => {
  try {
    const { dirName, subProjectName, isAdd, projectInfo, result } = payload;
    //项目文件夹地址
    const projectDirPath = path.join(
      appConfigFilePath,
      'user',
      'project',
      dirName,
      subProjectName,
    );
    //判断文件是否存在
    const dirFlag = await pathExists(projectDirPath);
    //如果文件存在,且是新增
    if (dirFlag) {
      if (isAdd) return Promise.resolve({ code: 1, msg: '项目已存在!' });
    }
    //如果是编辑,且文件不存在
    else {
      if (!isAdd)
        return Promise.resolve({ code: 1, msg: '未找到此项目,请刷新后重试!' });
    }
    //好了,现在开始处理创建逻辑
    //1先确保文件夹存在
    await ensureDir(projectDirPath);
    //2.写入projectInfo.json
    const projectInfoPath = path.join(projectDirPath, 'projectInfo.json');
    await outputJson(projectInfoPath, projectInfo);
    //3.写入result数据
    const resultPath = path.join(projectDirPath, 'result.json');
    await outputJson(resultPath, result);
    return Promise.resolve({ code: 0 });
  } catch (error) {
    const msg = `createProject 158 error: ${error?.toString()}`;
    logError(msg);
    console.error(msg);
    return Promise.reject(msg);
  }
};
