/*
 * @Author: feifei
 * @Date: 2023-10-18 14:51:01
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:49:12
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\functionList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
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
} from 'fs-extra';
import { statSync } from 'fs';

import { v4 as uuidv4 } from 'uuid';
import path from 'path';
const fsPromises = require('fs').promises;

import { appConfigFilePath } from '../publicData';
import { createSpectrumConnection } from '../utils';
import { query_fn } from '../api/api';
import { logError } from '../logger/logLevel';
//删除某一条的结果
export const deleteResult = async (payload) => {
  try {
    const { resultFilePath, row } = payload;
    const resultList = await readJson(resultFilePath);
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

export const getJsonFile = async (filePath) => {
  try {
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
export const getJsonFileByFilePath = async (laseFilePath) => {
  try {
    const filePath = path.join(appConfigFilePath, laseFilePath);
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
//setProjectInfoToJson
export const setProjectInfoToJson = async (data) => {
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
// writeJsonFile
export const writeJsonFile = async (payload) => {
  try {
    const { laseFilePath, data } = payload;
    const filePath = path.join(appConfigFilePath, laseFilePath);
    await outputJson(filePath, data);
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve({ type: 'error', msg: error });
  }
};
//创建项目目录
export const createDir = (laseFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      //1.先以项目名称为名字,创建项目文件夹
      const filePath = path.join(appConfigFilePath, laseFilePath);
      try {
        //判断文件是否存在
        await fsPromises.access(filePath);
        reject(new Error('项目已存在'));
      } catch (error) {
        //文件不存在
        //创建文件夹
        await fsPromises.mkdir(filePath);
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};
//addSubProject
export const addSubProject = async (payload) => {
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
export const getSubProjectList = async (projectName) => {
  try {
    //子项目的根目录
    const folderPath = path.join(
      appConfigFilePath,
      'user/project',
      projectName,
    );
    const fileList = await readdir(folderPath);
    const folders = fileList.filter((item) => {
      const fullPath = `${folderPath}/${item}`;
      return statSync(fullPath).isDirectory();
    });
    const rst = folders.map((item) => {
      const fullPath = `${folderPath}/${item}`;
      const obj = statSync(fullPath);
      let createTime = 0;
      if (obj.birthtimeMs) {
        createTime = Math.floor(obj.birthtimeMs);
      }

      return { subProjectName: item, id: uuidv4(), createTime };
    });
    rst.sort((a, b) => {
      return b.createTime - a.createTime;
    });
    return Promise.resolve(rst);
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};

//testLinkIsEnabledFn
export const testLinkIsEnabledFn = async (payload) => {
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
export const archiveProject = async (projectName) => {
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

export const getImageBase4 = async (paylaod) => {
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
    const imgBase64 = await fsPromises.readFile(filePath, 'base64');
    const prefix = 'data:image/png;base64,';
    const resultData = prefix + imgBase64;
    return Promise.resolve(resultData);
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    return Promise.reject(error);
  }
};
