/*
 * @Author: feifei
 * @Date: 2024-12-02 17:01:34
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-25 15:43:14
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\util\BandEdgeHandle.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { loopFn } from './formData';
import { logError } from '@/utils/logLevel';
import {
  AddFormValueType,
  ResultItemType,
  TestItemType,
  SupRowType,
  RBItemType,
} from '@src/customTypes/renderer';
const { ipcRenderer } = window.myApi;

const findItemHandle = (findItem, subItem) => {
  const {
    start: startList,
    stop: stopList,
    RBW: RBW_LIST,
    VBW: VBW_LIST,
    no,
    limit,
    sweepTime,
    sweepPoint,
  } = findItem;
  return {
    start: loopFn(startList, subItem),
    stop: loopFn(stopList, subItem),
    RBW: loopFn(RBW_LIST, subItem),
    VBW: loopFn(VBW_LIST, subItem),
    no,
    limit,
    sweepTime,
    sweepPoint,
  };
};

const findEmissionItem = async (emissionList, BW, RB, level, Band) => {
  try {
    const tempRB = RB === 'Outer_Full' ? 'FUll' : 1;
    const tempLevel = level[0]; //L,M,H
    const tempBW = String(BW);
    const findItem = emissionList.find((emissionItem) => {
      const BW_FLAG =
        emissionItem.BW === 'all' ||
        emissionItem.BW == tempBW ||
        `${emissionItem.BW}`.includes(tempBW);
      const RBFlag = emissionItem.RB == tempRB;
      const levelFlag = emissionItem.level === tempLevel;
      return RBFlag && BW_FLAG && levelFlag;
    });
    if (findItem) {
      return Promise.resolve(findItem);
    } else {
      return Promise.reject(
        `请检查emissionLimit配置表 ${Band} RB<${tempRB}> BW<${BW}> level<${level}> 是否存在 `,
      );
    }
  } catch (error) {
    const msg = `请检查emissionLimit配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `;
    logError(msg);
    return Promise.reject(msg);
  }
};
export default async (supList: ResultItemType[], isGate: boolean) => {
  try {
    const emissionLimit = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      'app/emissionLimit.json',
    );
    const emissionLimitGate = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      'app/emissionLimitGate.json',
    );
    const RESULT = [];
    for (const supItem of supList) {
      //通过一下四个参数,找到匹配的emissionLimit配置
      const { Band, BW, RB, level, duplexMode } = supItem;
      let emissionList = emissionLimit[Band];
      if (duplexMode === 'TDD' && isGate) {
        emissionList = emissionLimitGate[Band];
      }
      const findItem = await findEmissionItem(
        emissionList,
        BW,
        RB,
        level,
        Band,
      );
      let TEMP_OBJ = findItemHandle(findItem, supItem);
      //对findItem进行处理 公式计算
      const tempSubItem = {
        ...supItem,
        ...TEMP_OBJ,
        isGate,
      };
      RESULT.push(tempSubItem);
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
