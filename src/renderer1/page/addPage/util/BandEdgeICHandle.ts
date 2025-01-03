/*
 * @Author: feifei
 * @Date: 2024-12-02 17:01:34
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-30 15:46:00
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\util\BandEdgeICHandle.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { loopFn } from './';
import { logError } from '@/utils/logLevel';

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

const findEmissionRow = async (emissionList, BW, RB, level, Band) => {
  try {
    const tempLevel = level[0]; //L,M,H   Low[0] = L
    const tempBW = String(BW);
    const findItem = emissionList.find((emissionItem) => {
      const BW_FLAG =
        emissionItem.BW === 'all' ||
        emissionItem.BW == tempBW ||
        `${emissionItem.BW}`.includes(tempBW);
      const RBFlag = emissionItem.RB == RB;
      const levelFlag = emissionItem.level === tempLevel;
      return RBFlag && BW_FLAG && levelFlag;
    });
    if (findItem) {
      return Promise.resolve(findItem);
    } else {
      return Promise.reject(
        `请检查user/limitConfig/bandEdge limit ic.xlsx配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `,
      );
    }
  } catch (error) {
    const msg = `请检查user/limitConfig/bandEdge limit ic.xlsx配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `;
    logError(msg);
    return Promise.reject(msg);
  }
};
export default async (supList) => {
  try {
    const emissionLimit = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      'app/emissionLimitIC.json',
    );
    const RESULT = [];
    for (const supItem of supList) {
      //通过一下四个参数,找到匹配的emissionLimit配置
      const { BW, RB, level, Band } = supItem;
      const emissionList = emissionLimit[Band];
      //获取Band对应的emissionList
      const findItem = await findEmissionRow(emissionList, BW, RB, level, Band);
      const TEMP_OBJ = findItemHandle(findItem, supItem);
      //对findItem进行处理 公式计算
      const tempSubItem = {
        ...supItem,
        ...TEMP_OBJ,
        isGate: false,
      };
      RESULT.push(tempSubItem);
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
