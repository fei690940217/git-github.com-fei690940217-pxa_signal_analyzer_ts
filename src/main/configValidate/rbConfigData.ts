/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\rbConfigData.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:59:26
 * @Descripttion:RB配置文件验证与生成
 */

import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path';
import { appConfigFilePath } from '../publicData';
const xlsx = require('node-xlsx').default;
import { chunk } from 'lodash';
import { outputJson, pathExists } from 'fs-extra';
import { logError } from '../logger/logLevel';

//RB配置文件地址
const configFilePath = path.join(appConfigFilePath, 'user/rbConfig');
//解析后存储地址
const rbConfigFilePath = path.join(
  appConfigFilePath,
  'app/addProjectRbConfig.json',
);
//测试用例

//表名验证与生成
const workbookNameHandle = (sheetName) => {
  return new Promise((resolve, reject) => {
    //表名,例 15Mkz,30Mkz
    let key = '';
    if (sheetName.includes('15')) {
      key = '15';
    } else if (sheetName.includes('30')) {
      key = '30';
    } else if (sheetName.includes('60')) {
      key = '60';
    }
    if (key) {
      resolve(key);
    } else {
      reject(`${sheetName}表 命名不符合要求`);
    }
  });
};
const RBValueHandle = (row) => {
  const { BW, Modulation, ...rest } = row;
  const tempObj = {};
  Object.entries(rest).forEach(([key, value]) => {
    try {
      let start_and_num_arr = value.split('/');
      tempObj[key] = {
        num: start_and_num_arr[0],
        start: start_and_num_arr[1],
      };
    } catch (error) {
      logError(error.toString());
      tempObj[key] = {
        num: '',
        start: '',
      };
    }
  });
  return tempObj;
};

//数组转对象
const ArrayToObject = (arr) => {
  const headers = arr[1];
  const tempList = arr.slice(2).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return chunk(tempList, 2);
};
//
const workbookHandle = (worksheet) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempObj = {};
      const list = ArrayToObject(worksheet);
      for (let item of list) {
        const [firstRow, secondRow] = item;
        //验证单元格格式
        const BW = firstRow['BW'];
        tempObj[BW] = {
          DFT: RBValueHandle(firstRow),
          CP: RBValueHandle(secondRow),
        };
      }
      resolve(tempObj);
    } catch (error) {
      reject(error);
    }
  });
};

//循环获取单表数据,参数为workbook 例:PAR:{15:xxx,30:xxx}
const sheetDataHandle = (workbook) => {
  return new Promise(async (resolve, reject) => {
    try {
      let addProjectRbConfig = {};
      //读表
      for (let workSheet of workbook) {
        const { name, data } = workSheet;
        //生成表名
        let key = await workbookNameHandle(name);
        const result = await workbookHandle(data);
        addProjectRbConfig[key] = result;
      }
      resolve(addProjectRbConfig);
    } catch (error) {
      reject(error);
    }
  });
};
const projectRbConfigGenerate = async (allList) => {
  try {
    const addProjectRbConfig = {};
    for (let { testItem, workSheets } of allList) {
      addProjectRbConfig[testItem] = await sheetDataHandle(workSheets);
    }
    //找到BandEdge>复制一份生成BandEdgeIC
    return Promise.resolve(addProjectRbConfig);
  } catch (error) {
    logError(error.toString());
    return Promise.reject(error);
  }
};
//把user/rbConfig/BandEdge.xlsx,PAR.xlsx,....全部读到一起存起来
const readAllWorkbook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const testItems = ['BandEdge', 'CSE', 'OBW', 'PAR', 'MOP'];
      const rst = [];
      for (let testItem of testItems) {
        const filePath = path.join(configFilePath, `${testItem}.xlsx`);
        //文件存在
        try {
          await fsPromises.access(filePath);
          //读表
          const workSheets = xlsx.parse(filePath);
          rst.push({ testItem, workSheets });
        } catch (error) {
          //文件不存在>不做处理
          logError(error.toString());
        }
      }
      resolve(rst);
    } catch (error) {
      reject(error);
    }
  });
};
export default async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(rbConfigFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    //把所有表全部读出来,存起来备用
    const allList = await readAllWorkbook();
    //生成并存储  addProjectRbConfig
    const addProjectRbConfig = await projectRbConfigGenerate(allList);
    await outputJson(rbConfigFilePath, addProjectRbConfig);
  } catch (error) {
    logError(error?.toString() || 'rbConfig生成失败');
  }
};
