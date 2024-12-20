/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\LTE_Band_List.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:00:04
 * @Descripttion:CSE limit与Band对照表
 */

import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path';
import { appConfigFilePath } from '../publicData';
const xlsx = require('node-xlsx').default;
import { outputJson, pathExists } from 'fs-extra';
import { logError } from '../logger/logLevel';

//配置文件地址 源文件
const configFilePath = path.join(
  appConfigFilePath,
  'user/operating bands/LTE_Band.xlsx',
);
//写入本地 解析后写入本地
const filePath = path.join(appConfigFilePath, 'app/LTE_Band_List.json');
export default async (isRefresh) => {
  try {
    //如果是刷新则直接重新生成
    if (!isRefresh) {
      const flag = await pathExists(filePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const reg = /[\t\r\f\n\s]*/g;
    const resultList = [];
    //判断文件是否存在
    await fsPromises.access(configFilePath);
    const workSheetsList = xlsx.parse(configFilePath);
    const { name, data } = workSheetsList[0];
    //去掉表头
    const newWorksheet = data.slice(1);
    //生成表名
    for (let item of newWorksheet) {
      // duplexMode双工模式 TDD/FDD
      const [tempBand, FL, FH, duplexMode] = item;
      //去空格
      if (!tempBand) {
        break;
      }
      const Band = tempBand.replace(reg, '');
      resultList.push({
        Band,
        FL,
        FH,
        duplexMode,
      });
    }
    await outputJson(filePath, resultList);
    return Promise.resolve();
  } catch (error) {
    logError(error?.toString() || 'LTE_Band_List.ts 生成失败');
    return Promise.reject();
  }
};
