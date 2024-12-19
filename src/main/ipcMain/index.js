/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 09:31:25
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\index.js
 * @Description: 监听渲染进程事件
 *
 */
const path = require('path');
const { ipcMain, shell, dialog } = require('electron');
const childProcess = require('child_process');
const configValidate = require('../configValidate');
const { move, remove, copy } = require('fs-extra');
const { electronStore, appConfigFilePath } = require('../publicData');
const generateDocx = require('../utils/generateDocx');
const logger = require('../logger');
const {
  deleteResult,
  addSubProject,
  getSubProjectList,
  testLinkIsEnabledFn,
  getJsonFileByFilePath,
  writeJsonFile,
  createDir,
  setProjectInfoToJson,
} = require('./functionList');
//子进程启动函数
const {
  createTestProcessInstance,
  getTestProcessInstance,
} = require('./testProcess/TestProcessSingleton.js');
//runVisaProxy
const forceRestartVisaProxy = require('../utils/forceRestartVisaProxy');
const { mainSendRender } = require('../utils');
//用户主动结束测试
const abortTest = require('../utils/abortTest.js');
const getLineLoss = require('./getLineLoss');
const { getJsonFile, setJsonFile } = require('./getAndSetJsonFile.js');

module.exports = () => {
  //验证配置文件>config文件夹,用户定义
  ipcMain.on('refreshConfigFile', () => {
    configValidate();
  });

  //移动文件夹
  ipcMain.handle('moveFile', (e, data) => {
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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
  ipcMain.on('electron-store-get', (event, val) => {
    event.returnValue = electronStore.get(val);
  });
  //electron-store-get 异步版本
  ipcMain.handle('electron-store-get-async', (event, val) => {
    return electronStore.getAsync(val);
  });
  ipcMain.on('electron-store-set', (event, payload) => {
    const { key, val } = payload;
    electronStore.set(key, val);
  });
  //测试专用,无其他作用
  ipcMain.on('test', (event, val) => {
    console.log('接到前端测试信号', val);
    console.log(event);
    event.returnValue = '你好世界';
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
    return new Promise(async (resolve, reject) => {
      try {
        await generateDocx(value);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
  //打开指定的文件夹
  ipcMain.on('showItemInFolder', (event, payload) => {
    const { projectName, subProjectName } = payload;
    const dirpath = path.join(
      appConfigFilePath,
      'user',
      'project',
      projectName,
      subProjectName,
    );
    shell.openPath(dirpath);
  });

  //打开选择文件对话框
  ipcMain.handle('showOpenDialog', async (e, filePath) => {
    return await getLineLoss();
  });

  //deleteResult>前端通知main进程删除某一条的测试结果
  ipcMain.handle('deleteResult', (e, payload) => {
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
  //writeFile
  ipcMain.handle('writeJsonFile', (e, payload) => {
    return writeJsonFile(payload);
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
    const { level, msg } = payload;
    logger[level](msg);
  });
};
