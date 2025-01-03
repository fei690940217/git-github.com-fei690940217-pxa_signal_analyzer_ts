/*
 * @Author: feifei
 * @Date: 2023-10-18 14:51:01
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 17:08:44
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\functionList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { createAddWindow } from '@src/main/addWindowManager';
import { pinpuConnectionName } from '@src/common';
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
} from 'fs-extra';
import { statSync, promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { appConfigFilePath } from '../publicData';
import { createSpectrumConnection } from '../utils';
import { query_fn } from '../api/api';
import { logError } from '../logger/logLevel';
import { DeleteResultPayload } from '@src/customTypes/main';
import { ResultItemType, ProjectItemType } from '@src/customTypes/renderer';
import {
  AddDirType,
  OpenTheProjectWindowPayload,
} from '@src/customTypes/index';

//删除某一条的结果
export const deleteResult = async (payload: DeleteResultPayload) => {
  try {
    const { projectName, subProjectName, row } = payload;
    const resultFilePath = path.join(
      appConfigFilePath,
      'user/project',
      projectName,
      subProjectName,
      'result.json',
    );
    const resultList: ResultItemType[] = await readJson(resultFilePath);
    const RESULT = resultList.map((item) => {
      const { id } = item;
      if (id === row.id) {
        item.result = '';
      }
      return item;
    });
    await outputJson(resultFilePath, RESULT);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getJsonFileByFilePath = async (laseFilePath: string) => {
  try {
    const filePath = path.join(appConfigFilePath, laseFilePath);
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
//setProjectInfoToJson
export const setProjectInfoToJson = async (data: ProjectItemType) => {
  try {
    const { projectName } = data;
    const filePath = path.join(
      appConfigFilePath,
      'user/project',
      projectName,
      'projectInfo.json',
    );
    await outputJson(filePath, data);
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
//创建项目目录
export const createDir = (laseFilePath: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      //1.先以项目名称为名字,创建项目文件夹
      const filePath = path.join(appConfigFilePath, laseFilePath);
      //判断文件是否存在
      const flag = await pathExists(filePath);
      if (flag) {
        reject(new Error('项目已存在'));
      } else {
        await mkdir(filePath);
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};
//addSubProject
type AddSubProjectPayload = {
  projectName: string;
  subProjectName: string;
};
export const addSubProject = async (payload: AddSubProjectPayload) => {
  const { projectName, subProjectName } = payload;
  const currentRowFilePath = path.join(
    appConfigFilePath,
    'user/project',
    projectName,
  );
  //测试记录文件地址
  const subProjectFilePath = path.join(currentRowFilePath, subProjectName);
  try {
    const imgFilePath = path.join(subProjectFilePath, 'img');
    //确保子文件夹存在
    await ensureDir(imgFilePath);
    //复制文件  src,dest
    const src = path.join(currentRowFilePath, 'result.json');
    const dest = path.join(subProjectFilePath, 'result.json');
    await copy(src, dest);
    //复制项目信息
    try {
      const src = path.join(currentRowFilePath, 'projectInfo.json');
      const dest = path.join(subProjectFilePath, 'projectInfo.json');
      await copy(src, dest);
    } catch (error) {
      const msg = `addSubProject 复制项目信息 error: ${error} `;
      logError(msg);
    }

    return Promise.resolve();
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    await remove(subProjectFilePath);
    return Promise.reject(error);
  }
};

//getSubProjectList
export const getSubProjectList = async (dirtName: string) => {
  try {
    //子项目的根目录
    const folderPath = path.join(
      appConfigFilePath,
      'user',
      'project',
      dirtName,
    );
    const RST: ProjectItemType[] = [];
    const fileList = await readdir(folderPath);

    for (const item of fileList) {
      const fullPath = `${folderPath}/${item}/projectInfo.json`;
      const flag = await pathExists(fullPath);
      if (flag) {
        const obj: ProjectItemType = await readJson(fullPath);
        RST.push(obj);
      }
    }
    return Promise.resolve(RST);
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};

//testLinkIsEnabledFn
export const testLinkIsEnabledFn = async (payload: { ip: string }) => {
  try {
    const { ip } = payload;
    if (ip) {
      //创建频谱连接
      await createSpectrumConnection(ip);
      //如果创建成功,给仪表发一条指令
      const rst = await query_fn({
        instr_name: pinpuConnectionName,
        command: '*IDN?',
      });
      return Promise.resolve(rst);
    } else {
      return Promise.reject('请输入正确的IP地址');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

//archiveProject
export const archiveProject = async (projectName: string) => {
  try {
    const src = path.join(appConfigFilePath, 'user/project', projectName);
    const dest = path.join(appConfigFilePath, 'user/archive', projectName);
    let finalDest = dest;
    //判断路径是否存在
    const flag = await pathExists(dest);
    if (flag) {
      finalDest = `${dest}_${Date.now()}`;
    }
    await move(src, finalDest);
    return Promise.resolve();
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};

export const getImageBase4 = async (paylaod: {
  projectName: string;
  subProjectName: string;
  id: number;
}) => {
  try {
    const { projectName, subProjectName, id } = paylaod;
    const filePath = path.join(
      appConfigFilePath,
      'user',
      'project',
      projectName,
      subProjectName,
      'img',
      `${id}.png`,
    );
    //判断路径是否存在
    const flag = await pathExists(filePath);
    if (!flag) {
      return Promise.reject('文件不存在,请检查路径');
    }
    const imgBase64 = await readFile(filePath, 'base64');
    const prefix = 'data:image/png;base64,';
    const resultData = prefix + imgBase64;
    return Promise.resolve(resultData);
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};
//启动项目窗口
export const openTheProjectWindow = (payload: OpenTheProjectWindowPayload) => {
  createAddWindow(payload);
};

//新建目录
export const addDirFn = async (payload: AddDirType) => {
  try {
    const { dirName } = payload;
    //1.先判断文件夹是否存在
    const dirPath = path.join(appConfigFilePath, 'user', 'project', dirName);
    //判断文件是否存在
    const flag = await pathExists(dirPath);
    if (flag) {
      return Promise.resolve({ code: 1, msg: '文件夹已存在' });
    }
    //继续
    //确保文件夹存在
    await ensureDir(dirPath);
    //写入dirInfo.json文件
    const dirInfoPath = path.join(dirPath, 'dirInfo.json');
    await outputJson(dirInfoPath, payload);
    return Promise.resolve({ code: 0, msg: '' });
  } catch (error) {
    return Promise.reject(error);
  }
};

//目录归档
export const archiveDir = async (dirName: string) => {
  try {
    const dirPath = path.join(appConfigFilePath, 'user/archive/dir');
    //确保归档文件夹存在
    await ensureDir(dirPath);
    const src = path.join(appConfigFilePath, 'user/project', dirName);
    const dest = path.join(appConfigFilePath, 'user/archive/dir', dirName);
    let finalDest = dest;
    //判断路径是否存在
    const flag = await pathExists(dest);
    if (flag) {
      finalDest = `${dest}_${Date.now()}`;
    }
    await move(src, finalDest);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
