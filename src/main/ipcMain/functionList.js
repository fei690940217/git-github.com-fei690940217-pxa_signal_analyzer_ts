/*
 * @Author: feifei
 * @Date: 2023-10-18 14:51:01
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:24:25
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\ipcMain\functionList.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

const {
  remove,
  ensureDir,
  copy,
  readJson,
  outputJson,
  readdir,
} = require("fs-extra");
const { statSync } = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fsPromises = require("fs").promises;

const { appConfigFilePath, pinpuConnectionName } = require("../publicData");
const { createSpectrumConnection } = require("../utils");
const { query_fn } = require("../api/api");
const { logError } = require("../logger/logLevel");
//删除某一条的结果
exports.deleteResult = async (payload) => {
  try {
    const { resultFilePath, row } = payload;
    const resultList = await readJson(resultFilePath);
    const RESULT = resultList.map((item) => {
      const { id } = item;
      if (id === row.id) {
        item.result = "";
      }
      return item;
    });
    await outputJson(resultFilePath, RESULT);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getJsonFile = async (filePath) => {
  try {
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: "error", msg: error });
  }
};
exports.getJsonFileByFilePath = async (laseFilePath) => {
  try {
    const filePath = path.join(appConfigFilePath, laseFilePath);
    const resultObj = await readJson(filePath);
    return Promise.resolve(resultObj);
  } catch (error) {
    return Promise.resolve({ type: "error", msg: error });
  }
};
//setProjectInfoToJson
exports.setProjectInfoToJson = async (data) => {
  try {
    const { projectName } = data;
    const filePath = path.join(
      appConfigFilePath,
      "user/project",
      projectName,
      "projectInfo.json"
    );
    await outputJson(filePath, data);
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve({ type: "error", msg: error });
  }
};
// writeJsonFile
exports.writeJsonFile = async (payload) => {
  try {
    const { laseFilePath, data } = payload;
    const filePath = path.join(appConfigFilePath, laseFilePath);
    await outputJson(filePath, data);
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve({ type: "error", msg: error });
  }
};
//创建项目目录
exports.createDir = (laseFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      //1.先以项目名称为名字,创建项目文件夹
      const filePath = path.join(appConfigFilePath, laseFilePath);
      try {
        //判断文件是否存在
        await fsPromises.access(filePath);
        reject(new Error("项目已存在"));
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
exports.addSubProject = async (payload) => {
  const { projectName, subProjectName } = payload;
  const currentRowFilePath = path.join(
    appConfigFilePath,
    "user/project",
    projectName
  );
  //测试记录文件地址
  const subProjectFilePath = path.join(currentRowFilePath, subProjectName);
  try {
    const imgFilePath = path.join(subProjectFilePath, "img");
    //确保子文件夹存在
    await ensureDir(imgFilePath);
    //复制文件  src,dest
    const src = path.join(currentRowFilePath, "result.json");
    const dest = path.join(subProjectFilePath, "result.json");
    await copy(src, dest);
    //复制项目信息
    try {
      const src = path.join(currentRowFilePath, "projectInfo.json");
      const dest = path.join(subProjectFilePath, "projectInfo.json");
      await copy(src, dest);
    } catch (error) {
      const msg = `addSubProject 复制项目信息 error: ${error} `
      logError(msg)
    }

    return Promise.resolve();
  } catch (error) {
    //报错后需要判断子文件夹是否已创建,如果创建的话删掉
    await remove(subProjectFilePath);
    return Promise.reject(error);
  }
};

//getSubProjectList
exports.getSubProjectList = async (projectName) => {
  try {
    //子项目的根目录
    const folderPath = path.join(
      appConfigFilePath,
      "user/project",
      projectName
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
exports.testLinkIsEnabledFn = async (payload) => {
  try {
    const { ip } = payload;
    if (ip) {
      //创建频谱连接
      await createSpectrumConnection(ip);
      //如果创建成功,给仪表发一条指令
      const rst = await query_fn({
        instr_name: pinpuConnectionName,
        command: "*IDN?",
      });
      return Promise.resolve(rst);
    } else {
      return Promise.reject("请输入正确的IP地址");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
