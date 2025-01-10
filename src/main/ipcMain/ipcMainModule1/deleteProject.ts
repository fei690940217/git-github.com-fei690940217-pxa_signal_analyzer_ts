/*
 * @Author: feifei
 * @Date: 2025-01-09 11:37:47
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 13:15:02
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\deleteProject.ts
 * @Description:  对子项目进行归档
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { ArchiveProjectPayload, ApiResponseType } from '@src/customTypes';
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

//移动项目文件夹
export const moveProject = async (form: string, to: string) => {
  try {
    let finalDest = to;
    //判断路径是否存在
    const flag = await pathExists(finalDest);
    if (flag) {
      finalDest = `${finalDest}_${Date.now()}`;
    }
    await move(form, finalDest);
    return Promise.resolve();
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};

export default async (
  payload: ArchiveProjectPayload,
): Promise<ApiResponseType> => {
  try {
    const { dirName, subProjectNameList } = payload;
    //项目文件夹地址
    const dirPath = path.join(appConfigFilePath, 'user', 'project', dirName);
    //判断文件夹是否存在
    const dirflag = await pathExists(dirPath);
    if (!dirflag) return Promise.resolve({ code: 1, msg: '项目文件夹不存在' });
    const promiseList = subProjectNameList.map((item) => {
      const formPath = path.join(dirPath, item);
      return remove(formPath);
    });
    const rstList = await Promise.allSettled(promiseList);
    return Promise.resolve({ code: 0, data: rstList });
  } catch (error) {
    const msg = `deleteProject 63 error: ${error?.toString()}`;
    logError(msg);
    console.error(msg);
    return Promise.reject(msg);
  }
};
