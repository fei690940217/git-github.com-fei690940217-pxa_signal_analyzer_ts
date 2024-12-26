/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\NR_Band_List.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-23 13:55:56
 * @Descripttion:NR频段表/FCC,CE,TELEC
 */

import path from 'path';
import { appConfigFilePath } from '../publicData';
import xlsx from 'node-xlsx';
import { outputJson, pathExists, readJson } from 'fs-extra';
import { logError } from '../logger/logLevel';
import { NRBandObjType } from '@src/customTypes/main';
const reg = /\s/g;
//配置文件地址
const configFilePath = path.join(
  appConfigFilePath,
  'user/operating bands/NR认证频段.xlsx',
);
//写入本地
const filePath = path.join(appConfigFilePath, 'app/authTypeObj.json');

//单表数据处理
const xlsxDataHandle = (data: any[][]) => {
  const tempArr = [];
  //去掉表头
  const newWorksheet = data.slice(1);
  //生成表名
  for (let item of newWorksheet) {
    // duplexMode双工模式 TDD/FDD
    const [
      tempBand,
      FL,
      FH,
      CSE_Limit,
      MOP_LOW_Limit,
      MOP_UP_Limit,
      duplexMode,
    ] = item;
    //去空格
    if (!tempBand) {
      break;
    }
    const Band = tempBand.replace(reg, '');
    tempArr.push({
      Band,
      FL,
      FH,
      CSE_Limit,
      duplexMode,
      MOP_LOW_Limit,
      MOP_UP_Limit,
    });
  }
  return tempArr;
};

export default async (isRefresh: boolean) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(filePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const resultObj: NRBandObjType = { FCC: [], CE: [], TELEC: [] };
    //判断配置文件是否存在
    const isExist = await pathExists(configFilePath);
    if (!isExist) {
      logError('user/operating bands/NR认证频段.xlsx 文件不存在,请检查');
      return Promise.reject(
        'user/operating bands/NR认证频段.xlsx 文件不存在,请检查',
      );
    }
    const workSheetsList = xlsx.parse(configFilePath);
    const certificationTypeList: (keyof NRBandObjType)[] = [
      'FCC',
      'CE',
      'TELEC',
    ];
    for (let certificationItem of certificationTypeList) {
      const findSheet = workSheetsList.find(
        (item) => item.name === certificationItem,
      );
      if (!findSheet) {
        continue;
      }
      const { data } = findSheet;
      resultObj[certificationItem] = xlsxDataHandle(data);
    }
    await outputJson(filePath, resultObj);
    return Promise.resolve();
  } catch (error) {
    const msg = `authTypeObj.js 77 ${error}`;
    logError(msg);
    return Promise.reject(error);
  }
};
