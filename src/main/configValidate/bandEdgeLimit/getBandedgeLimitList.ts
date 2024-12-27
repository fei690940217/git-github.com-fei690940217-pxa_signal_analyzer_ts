/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\bandEdgeLimit\getBandedgeLimitList.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 16:17:03
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
import XLSX from 'xlsx';
import { logError } from '@src/main/logger/logLevel';
import { BandEdgeEmissionLimitConfigType } from '@src/customTypes/main';

//临时使用,未处理之前的数据
type tempLimit = {
  RB: string;
  BW: string;
  level: string;
  no: number;
  start: string;
  stop: string;
  RBW: string;
  VBW: string;
  limit: string;
  sweepPoint: string;
  sweepTime: string;
};
type GroupsType = {
  [key: string]: tempLimit[];
};
type RESULTType = {
  [key: string]: BandEdgeEmissionLimitConfigType[];
};
const header = [
  'RB',
  'BW',
  'level',
  'no',
  'start',
  'stop',
  'RBW',
  'VBW',
  'limit',
  'sweepTime',
  'sweepPoint',
];
//配置文件地址
//n2&n25  对表明进行处理list化
const getBandList = (name: string) => {
  try {
    if (name) {
      return name.split('&');
    } else {
      return [];
    }
  } catch (error) {
    const msg = `getBandedgeLimitList.js 23行 错误:${error}`;
    logError(msg);
    return [];
  }
};
//按照RB level,BW相同的原则分组
const groupByRBAndBWAndLevel = (list: tempLimit[], sheetName: string) => {
  const tempObj = list.reduce((groups: GroupsType, item) => {
    const { RB, BW, level } = item;
    const key = `${RB}-${BW}-${level}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  const resultArr = Object.values(tempObj).map((itemList) => {
    const tempItemList = itemList.sort((a, b) => a.no - b.no);
    //找到最大的no
    const noList = itemList.map((item) => item.no);
    const maxNo = Math.max(...noList);
    const start = tempItemList.map((item) => item.start);
    const stop = tempItemList.map((item) => item.stop);
    const RBW = tempItemList.map((item) => item.RBW);
    const VBW = tempItemList.map((item) => item.VBW);
    const limit = tempItemList.map((item) => item.limit);
    const sweepPoint = tempItemList.map((item) => item.sweepPoint);
    const sweepTime = tempItemList.map((item) => item.sweepTime);
    return {
      RB: tempItemList[0].RB,
      BW: tempItemList[0].BW,
      level: tempItemList[0].level,
      no: maxNo,
      start,
      stop,
      RBW,
      VBW,
      limit,
      sweepPoint,
      sweepTime,
    };
  });
  //处理name,&
  const RESULT: RESULTType = {};
  const bandList = getBandList(sheetName);
  bandList.forEach((item) => {
    RESULT[item] = resultArr;
  });
  return RESULT;
};

export default async (configFilePath: string) => {
  try {
    let RESULT = {};

    const wb = XLSX.readFile(configFilePath);
    //判断文件是否存在
    const { Sheets, Workbook } = wb;
    for (const sheetItem of Workbook?.Sheets || []) {
      const { name, Hidden } = sheetItem;
      if (Hidden === 1 || !name) {
        continue;
      }
      const sheet = Sheets[name];
      const json = XLSX.utils.sheet_to_json<tempLimit>(sheet, {
        range: 1,
        header,
        defval: '',
        raw: false, // 禁用原始文本模式
        // blankrows: false, // 不忽略空行
      });
      const newJson = groupByRBAndBWAndLevel(json, name);
      Object.assign(RESULT, newJson);
    }
    return Promise.resolve(RESULT);
    // await jsonfile.writeFile(resultconfigFilePath, RESULT);
  } catch (error) {
    const msg = `getBandedgeLimitList.js 113行 错误:${error}`;
    logError(msg);
    return Promise.reject(error);
  }
};
