/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\RBConfigSelectedList.ts
 * @Author: xxx
 * @Date: 2023-04-03 15:00:16
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 17:54:38
 * @Descripttion:  存储前端使用的RB表格,供用户选择
 */

import { RBObjType, RBItemType, TestItemType } from '@src/customTypes/renderer';
import { appConfigFilePath } from '../publicData';
import path from 'path';
import { outputJson, pathExists } from 'fs-extra';
import { logError } from '../logger/logLevel';
// 目的地路径
const toPath = path.join(appConfigFilePath, `app/RBConfigSelectedList.json`);

//-----------------------------------------------------------

type modulateItemType = {
  OFDM: 'DFT' | 'CP';
  modulate: 'BPSK' | 'QPSK' | '16QAM' | '64QAM' | '256QAM';
};
//通用的
const modulateList: modulateItemType[] = [
  { OFDM: 'DFT', modulate: 'BPSK' },
  { OFDM: 'DFT', modulate: 'QPSK' },
  { OFDM: 'DFT', modulate: '16QAM' },
  { OFDM: 'DFT', modulate: '64QAM' },
  { OFDM: 'DFT', modulate: '256QAM' },
  { OFDM: 'CP', modulate: 'QPSK' },
  { OFDM: 'CP', modulate: '16QAM' },
  { OFDM: 'CP', modulate: '64QAM' },
  { OFDM: 'CP', modulate: '256QAM' },
];
type LevelObjType = {
  level: 'L' | 'H';
};
//bandEdgeIc专用
const Band_Edge_Ic_Rb_Name_List = [
  'Outer_Full_Left',
  'Outer_Full_Right',
  'Edge_1RB_Left',
  'Edge_1RB_Right',
];
//bandEdge 分为两组
const Band_Edge_Rb_Name_List_Low = ['Outer_Full', 'Edge_1RB_Left'];
const Band_Edge_Rb_Name_List_High = ['Outer_Full', 'Edge_1RB_Right'];
//PAR
const PAR_Rb_Name_List = ['Outer_Full', 'Inner_1RB_Left', 'Inner_1RB_Right'];
//OBW
const OBW_Rb_Name_List = ['Outer_Full'];
//CSE
const CSE_Rb_Name_List = ['Outer_Full', 'Inner_1RB_Left', 'Inner_1RB_Right'];

const BandEdgeFn = () => {
  const levelL: LevelObjType = { level: 'L' };
  const levelH: LevelObjType = { level: 'H' };
  const lowResult = modulateList.flatMap((modulateItem) => {
    return Band_Edge_Rb_Name_List_Low.map((RB) => {
      return { ...modulateItem, ...levelL, RB, id: 0 };
    });
  });
  const highResult = modulateList.flatMap((modulateItem) => {
    return Band_Edge_Rb_Name_List_High.map((RB) => {
      return { ...modulateItem, RB, ...levelH, id: 0 };
    });
  });
  const result = [...lowResult, ...highResult];
  const tempResult = result.map((item, index) => {
    item.id = index + 1;
    return item;
  });
  return tempResult;
};
const handleFn = (Rb_Name_List: string[]) => {
  const tempList = modulateList.flatMap((modulation) => {
    const { OFDM, modulate } = modulation;
    return Rb_Name_List.map((RB) => {
      return {
        OFDM,
        modulate,
        RB,
        id: 0,
      };
    });
  });
  //创建id
  return tempList.map((item: RBItemType, index) => {
    item.id = index + 1;
    return item;
  });
};
// export const BandEdgeRBNameList = BandEdgeFn();

export default async (isRefresh: boolean) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(toPath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const BandEdge = BandEdgeFn();
    const BandEdgeIC = handleFn(Band_Edge_Ic_Rb_Name_List);
    const PAR = handleFn(PAR_Rb_Name_List);
    const OBW = handleFn(OBW_Rb_Name_List);
    const CSE = handleFn(CSE_Rb_Name_List);
    const RST: RBObjType = {
      BandEdge,
      BandEdgeIC,
      PAR,
      OBW,
      CSE,
    };
    await outputJson(toPath, RST);
  } catch (error) {
    const msg = `RBConfigSelectedList 配置文件生成失败,请检查 ${error}`;
    logError(msg);
  }
};
