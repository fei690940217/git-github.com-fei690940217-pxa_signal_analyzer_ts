/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\LTE_ARFCN.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:01:03
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
const fsPromises = require('fs').promises;
import { outputJson, pathExists, readJson } from 'fs-extra';

const xlsx = require('node-xlsx').default;
import path from 'path';
const reg = /[\t\r\f\n\s]*/g;
import { appConfigFilePath } from '../publicData';
import { logError } from '../logger/logLevel';

//配置文件地址
const configFilePath = path.join(
  appConfigFilePath,
  'user/operating bands/LTE_ARFCN.xlsx',
);
//解析后写入本地
const resultconfigFilePath = path.join(appConfigFilePath, 'app/LTE_ARFCN.json');
const LTE_Band_List_File_Path = path.join(
  appConfigFilePath,
  'app/LTE_Band_List.json',
);
//测试用例
//fdd表处理函数  downlink uplink   >上下行不相同需分开
const fddSheetHandle = (list) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(1);
      //分组 [Low,Mid,High]
      const chunkList = { Low: [], Mid: [], High: [] };
      //把第一位补足
      const arr = tempList.map((item, index) => {
        if (!item[0]) {
          item[0] = tempList[index - 1][0];
        }
        return item;
      });
      arr.forEach((item, index) => {
        if (item[0].includes('Low')) {
          chunkList['Low'].push(item);
        } else if (item[0].includes('Mid')) {
          chunkList['Mid'].push(item);
        } else if (item[0].includes('High')) {
          chunkList['High'].push(item);
        }
      });
      const tempObj = {};
      //
      for (let [key, itemList] of Object.entries(chunkList)) {
        //AFRCN取 DL(4)  freq取UL(3) BW(1)
        tempObj[key] = itemList.map((item) => {
          return { BW: item[1], AFRCN: item[4], FREQ: item[3] };
        });
      }
      resolve(tempObj);
    } catch (error) {
      const msg = `${error?.toString()} LTE_ARFCN.ts 64`;
      logError(msg);
      resolve({});
    }
  });
};
//tdd表处理函数  downlink == uplink
const tddSheetHandle = (list) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(1);
      //分组 [Low,Mid,High]
      const chunkList = { Low: [], Mid: [], High: [] };
      //把第一位补足
      const arr = tempList.map((item, index) => {
        if (!item[0]) {
          item[0] = tempList[index - 1][0];
        }
        return item;
      });
      arr.forEach((item, index) => {
        if (item[0].includes('Low')) {
          chunkList['Low'].push(item);
        } else if (item[0].includes('Mid')) {
          chunkList['Mid'].push(item);
        } else if (item[0].includes('High')) {
          chunkList['High'].push(item);
        }
      });
      const tempObj = {};
      //
      for (let [key, itemList] of Object.entries(chunkList)) {
        // BW(1)  AFRCN取 DL(2)  freq取UL(3)
        tempObj[key] = itemList.map((item) => {
          return { BW: item[1], AFRCN: item[2], FREQ: item[3] };
        });
      }
      resolve(tempObj);
    } catch (error) {
      const msg = `${error?.toString()} LTE_ARFCN.ts 104`;
      logError(msg);
      resolve({});
    }
  });
};

export default async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    let resultObj = {};
    //判断文件是否存在
    await fsPromises.access(configFilePath);
    const workSheetsList = xlsx.parse(configFilePath);

    const LTE_Band_List = await readJson(LTE_Band_List_File_Path);
    //循环表
    for (let worksheet of workSheetsList) {
      const { name, data } = worksheet;
      let isFDD = true;
      const Band = name.replace(reg, '');
      //在LTE_Band_List找到对应的Band,判断是不是FDD
      const findBandItem = LTE_Band_List.find((item) => {
        return item.Band === Band;
      });
      if (findBandItem) {
        isFDD = findBandItem?.['duplexMode'] === 'FDD';
      } else {
        continue;
      }
      let result = {};
      if (isFDD) {
        result = await fddSheetHandle(data);
      } else {
        result = await tddSheetHandle(data);
      }
      resultObj[Band] = result;
    }
    await outputJson(resultconfigFilePath, resultObj);
  } catch (error) {
    const msg = `${error?.toString()} LTE_ARFCN.ts 74`;
    logError(msg);
  }
};
