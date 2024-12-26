/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\NR_ARFCN.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 10:27:32
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
import xlsx from 'node-xlsx';
import { chunk } from 'lodash';
import path from 'path';
import { mainSendRender } from '../utils';
import { outputJson, pathExists, readJson } from 'fs-extra';
import { logError } from '../logger/logLevel';

import { appConfigFilePath } from '../publicData';
import { ARFCNConfigItem, BandItemType } from '@src/customTypes/main';
const reg = /\s/g; //去掉空格
type WorkSheetsList = {
  name: string;
  data: any[][];
};
//配置文件地址
const configFilePath = path.join(appConfigFilePath, 'user/operating bands/FCC');
//写入本地
// let resultconfigFilePath = path.join(
//   appConfigFilePath,
//   "app/addProjectConfig.json"
// );
let resultconfigFilePath = path.join(
  appConfigFilePath,
  'app/NR_ARFCN_Config.json',
);
//测试用例
const numHandle = (num: number | string) => {
  return Number(num).toFixed(2);
};
const levelList = ['L', 'M', 'H'];
const SARLevelList = ['L', 'LM', 'M', 'MH', 'H'];
//fdd表处理函数  downlink uplink   >上下行不相同需分开  一组6个
const fddSheetHandle = (
  list: any[][],
  allFilePath: string,
  Band: string,
  SCS: number,
) => {
  return new Promise<ARFCNConfigItem[]>((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成6个一组
      const chunkList = chunk(tempList, 6);
      const RST = chunkList.flatMap((itemList) => {
        const BW = itemList[0][0];
        // const [firstRow, secondRow, thirdRow, fourthRow, fifthRow] = itemList;
        return levelList.map((level, levelIndex) => {
          const obj = {
            level,
            ARFCN: numHandle(itemList[levelIndex + 3][4]),
            Freq: numHandle(itemList[levelIndex + 3][3]),
            isSAR: false,
            SCS,
            Band,
            BW,
          };
          return obj;
        });
      });
      resolve(RST);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确 ${error}`);
      mainSendRender('showConfigError', `请检查 ${allFilePath} 格式是否正确`);
      resolve([]);
    }
  });
};
//tdd表处理函数  downlink == uplink
const tddSheetHandle = (
  list: any[][],
  allFilePath: string,
  Band: string,
  SCS: number,
) => {
  return new Promise<ARFCNConfigItem[]>((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成6个一组
      const chunkList = chunk(tempList, 3);
      const RST = chunkList.flatMap((itemList) => {
        const BW = itemList[0][0];
        // const [firstRow, secondRow, thirdRow, fourthRow, fifthRow] = itemList;
        return levelList.map((level, levelIndex) => {
          const obj = {
            level,
            ARFCN: numHandle(itemList[levelIndex][4]),
            Freq: numHandle(itemList[levelIndex][3]),
            isSAR: false,
            SCS,
            Band,
            BW,
          };
          return obj;
        });
      });
      resolve(RST);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确`);
      mainSendRender('showConfigError', `请检查 ${allFilePath} 格式是否正确`);
      resolve([]);
    }
  });
};

//sar表处理函数  downlink == uplink
const sarSheetHandle = (
  list: any[][],
  allFilePath: string,
  Band: string,
  SCS: number,
) => {
  return new Promise<ARFCNConfigItem[]>((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成5个一组
      const chunkList = chunk(tempList, 5);
      const RST = chunkList.flatMap((itemList) => {
        const BW = itemList[0][0];
        // const [firstRow, secondRow, thirdRow, fourthRow, fifthRow] = itemList;
        return SARLevelList.map((level, levelIndex) => {
          const obj = {
            level,
            ARFCN: numHandle(itemList[levelIndex][4]),
            Freq: numHandle(itemList[levelIndex][3]),
            isEdge: false,
            isSAR: true,
            SCS,
            Band,
            BW,
          };
          return obj;
        });
      });
      resolve(RST);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确`);
      mainSendRender('showConfigError', `请检查 ${allFilePath} 格式是否正确`);
      resolve([]);
    }
  });
};
//判断表是否在BANDList中存在
const isPresentFn = (name: string, allBandList: BandItemType[]): boolean => {
  let tempName = name;
  if (name.includes('edge')) {
    tempName = name.replace('edge', '');
  } else if (name.includes('sar')) {
    tempName = name.replace('sar', '');
  }
  const findItem = allBandList.find(({ Band }) => {
    return Band === tempName;
  });
  if (findItem) {
    return true;
  } else {
    return false;
  }
};
const isFDDFn = (name: string, allBandList: BandItemType[]): boolean => {
  let tempName = name;
  if (name.includes('edge')) {
    tempName = name.replace('edge', '');
  }
  const findItem = allBandList.find(({ Band }) => {
    return Band === tempName;
  });
  if (findItem?.duplexMode === 'FDD') {
    return true;
  } else {
    return false;
  }
};
//循环获取单表数据,参数为workbook 例:workSheetsList [{name:'n2',data:[xx,xx]}]
const sheetDataHandle = (
  workSheetsList: WorkSheetsList[],
  allBandList: BandItemType[],
  filePath: string,
  SCS: number,
) => {
  return new Promise<ARFCNConfigItem[]>(async (resolve, reject) => {
    try {
      let tempArr: ARFCNConfigItem[] = [];
      //循环表
      for (let worksheet of workSheetsList) {
        const { name, data } = worksheet;
        const allFilePath = `${filePath} ${name}表`;
        const tempName = name.replace(reg, '');
        //Band是否存在
        const isPresent = isPresentFn(tempName, allBandList);
        let result: ARFCNConfigItem[] = [];
        if (!isPresent) {
          continue;
        }
        const isSAR = tempName.includes('sar');
        //SAR单独处理
        if (isSAR) {
          result = await sarSheetHandle(data, allFilePath, tempName, SCS);
        } else {
          const isFDD = isFDDFn(tempName, allBandList);
          if (isFDD) {
            result = await fddSheetHandle(data, allFilePath, tempName, SCS);
          } else {
            result = await tddSheetHandle(data, allFilePath, tempName, SCS);
          }
        }

        tempArr = tempArr.concat(result);
      }
      resolve(tempArr);
    } catch (error) {
      reject(error);
    }
  });
};

//本项目只处理FCC,暂不处理CE,TELEC
const authTypeItem = 'FCC';

export default async (isRefresh: boolean) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    //读取NR_Band_Obj
    const filePath = path.join(appConfigFilePath, 'app/authTypeObj.json');
    const authTypeObj = await readJson(filePath);
    const allBandList = authTypeObj[authTypeItem];
    let RESULT: ARFCNConfigItem[] = [];
    //for of bandList
    for (let SCS of [15, 30, 60]) {
      const filePath = path.join(configFilePath, `${SCS}KHz.xlsx`);
      //判断文件是否存在
      const flag = await pathExists(filePath);
      //如果文件不存在直接跳过
      if (!flag) continue;
      const workSheetsList = xlsx.parse(filePath);
      const subRST = await sheetDataHandle(
        workSheetsList,
        allBandList,
        filePath,
        SCS,
      );
      RESULT = RESULT.concat(subRST);
    }
    await outputJson(resultconfigFilePath, RESULT);
  } catch (error) {
    const msg = ` NR_ARFCN配置失败 请检查文件格式是否正确 241 ${error}`;
    logError(msg);
  }
};
