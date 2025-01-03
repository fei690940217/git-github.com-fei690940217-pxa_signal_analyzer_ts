/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 16:09:15
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\index.ts
 * @Description: 监听渲染进程事件
 *
 */
import path from 'path';
import { ipcMain, shell } from 'electron';
import configValidate from '../configValidate';
import {
  move,
  pathExists,
  readJson,
  readdir,
  remove,
  writeJson,
} from 'fs-extra';
import electronStore from '@src/main/electronStore';

import { appConfigFilePath } from '../publicData';
import generateDocx from '../utils/generateDocx';
import logger from '../logger';
import {
  deleteResult,
  addSubProject,
  getSubProjectList,
  testLinkIsEnabledFn,
  getJsonFileByFilePath,
  createDir,
  setProjectInfoToJson,
  archiveProject,
  archiveDir,
  getImageBase4,
  openTheProjectWindow,
  addDirFn,
} from './functionList';
//子进程启动函数
import {
  createTestProcessInstance,
  getTestProcessInstance,
} from './testProcess/TestProcessSingleton';
//runVisaProxy
import forceRestartVisaProxy from '../utils/forceRestartVisaProxy';
import { mainSendRender } from '../utils';
//用户主动结束测试
import abortTest from '../utils/abortTest';
import getLineLoss from './getLineLoss';
import { getJsonFile, setJsonFile } from './getAndSetJsonFile';
import { DeleteResultPayload } from '@src/customTypes/main';
import { AddDirType } from '@src/customTypes/index';
import { nanoid } from 'nanoid';
export default () => {
  //验证配置文件>config文件夹,用户定义
  ipcMain.on('refreshConfigFile', () => {
    //强制刷新
    configValidate(true);
  });

  //移动文件夹
  ipcMain.handle('moveFile', (e, data) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { src, dest } = data;
        await move(src, dest);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  //删除文件或者文件夹
  ipcMain.handle('removeFile', (e, fileName) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await remove(fileName);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  //强制重启visa   forceRestartVisaProxy
  ipcMain.handle('forceRestartVisaProxy', async (e) => {
    return forceRestartVisaProxy();
  });
  //electron-store操作函数
  ipcMain.on('electron-store-get', (event, payload) => {
    const { key } = payload;
    event.returnValue = electronStore.get(key);
  });
  //electron-store-get 异步版本
  ipcMain.handle('electron-store-get-async', (event, payload) => {
    const { key } = payload;

    return electronStore.getAsync(key);
  });
  ipcMain.on('electron-store-set', (event, payload) => {
    const { key, val } = payload;
    electronStore.set(key, val);
  });
  const TEST = async () => {
    try {
      //子项目的根目录
      const folderPath = path.join(
        appConfigFilePath,
        'user',
        'project',
        'SZ24100188 5G',
      );
      const fileList = await readdir(folderPath);

      for (const item of fileList) {
        const fullPath = `${folderPath}/${item}/projectInfo.json`;
        const flag = await pathExists(fullPath);
        if (flag) {
          const obj = await readJson(fullPath);
          obj.id = item;
          await writeJson(fullPath, obj);
        }
      }
      return Promise.resolve();
    } catch (error) {
      //报错后需要判断子文件夹是否已创建,如果创建的话删掉
      return Promise.reject(error);
    }
  };
  //测试专用,无其他作用
  ipcMain.on('test', (event, val) => {
    //使用脚本对projectInfo进行处理
    TEST();
  });
  //开始测试
  ipcMain.on('startTest', async (event, argv) => {
    //通知测试进程
    try {
      createTestProcessInstance(argv);
    } catch (error) {
      mainSendRender('showMessage', { type: 'error', content: String(error) });
    }
  });
  //暂停测试
  ipcMain.on('timeoutTest', async (event) => {
    const testProcess = getTestProcessInstance();
    //如果是测试中,则kill测试进程
    if (testProcess) {
      testProcess.sendMessageToChildProcess('timeoutTest');
    }
    //通知测试进程暂停测试
    // global.testProcess.postMessage({ event: "timeoutTest", value: "" });
  });
  //用户主动结束测试
  ipcMain.on('abortTest', async (event) => {
    abortTest('abort');
  });
  //测试专用
  //mainWindow > mainProcess > testWindow
  ipcMain.on('testFunction', async (event) => {});
  //前端通知main进程开始生成报告
  ipcMain.handle('generateDocx', (event, value) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await generateDocx(value);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  type ShowItemInFolderPayload = {
    projectName: string;
    dirName: string;
  };
  //打开指定的文件夹
  ipcMain.handle(
    'showItemInFolder',
    async (event, payload: ShowItemInFolderPayload) => {
      try {
        const { projectName, dirName } = payload;
        const dirpath = path.join(
          appConfigFilePath,
          'user',
          'project',
          dirName,
          projectName,
        );
        const str = await shell.openPath(dirpath);
        return Promise.resolve(str);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  );

  //打开选择文件对话框
  ipcMain.handle('showOpenDialog', async (e, filePath) => {
    return await getLineLoss();
  });

  //deleteResult>前端通知main进程删除某一条的测试结果
  ipcMain.handle('deleteResult', (e, payload: DeleteResultPayload) => {
    return deleteResult(payload);
  });

  //getJsonfile,根据路径获取json数据
  ipcMain.handle('getJsonFile', (e, payload) => {
    return getJsonFile(payload);
  });
  ipcMain.handle('setJsonFile', (e, payload) => {
    return setJsonFile(payload);
  });
  //getJsonFile
  ipcMain.handle('getJsonFileByFilePath', (e, payload) => {
    return getJsonFileByFilePath(payload);
  });
  //setProjectInfoToJson
  ipcMain.handle('setProjectInfoToJson', (e, payload) => {
    return setProjectInfoToJson(payload);
  });
  //createDir 创建文件夹
  ipcMain.handle('createDir', (e, payload) => {
    return createDir(payload);
  });
  //addSubProject
  ipcMain.handle('addSubProject', (e, payload) => {
    return addSubProject(payload);
  });
  //getSubProjectList
  ipcMain.handle('getSubProjectList', (e, payload) => {
    return getSubProjectList(payload);
  });
  //testLinkIsEnabled 判断连接是否可用
  ipcMain.handle('testLinkIsEnabled', (e, payload) => {
    return testLinkIsEnabledFn(payload);
  });
  //addLogRendererToMain,接到前端通知准备添加log
  ipcMain.on('addLogRendererToMain', (e, payload) => {
    const { level, msg }: { level: string; msg: string } = payload;
    logger.log({ level, message: msg });
  });

  //archiveProject 归档
  ipcMain.handle('archiveProject', async (e, payload) => {
    //新建或获取数据库
    return archiveProject(payload);
  });
  //目录 归档
  ipcMain.handle('archiveDir', async (e, payload) => {
    //新建或获取数据库
    return archiveDir(payload);
  });
  //archiveProject 归档
  ipcMain.handle('getImageBase4', async (e, payload) => {
    //新建或获取数据库
    return getImageBase4(payload);
  });
  type OpenTheProjectWindowPayload = {
    projectName: string;
    subProjectName?: string;
  };
  //openTheProjectWindow
  ipcMain.on(
    'openTheProjectWindow',
    (e, payload: OpenTheProjectWindowPayload) => {
      //新建或获取数据库
      openTheProjectWindow(payload);
    },
  );
  //add-dir
  ipcMain.handle('add-dir', async (e, payload: AddDirType) => {
    return addDirFn(payload);
  });

  //删除文件或者文件夹
  ipcMain.handle('removeDir', (e, dirName: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const dirPath = path.join(
          appConfigFilePath,
          'user',
          'project',
          dirName,
        );
        await remove(dirPath);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};
