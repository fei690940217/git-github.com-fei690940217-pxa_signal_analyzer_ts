/*
 * @Author: feifei
 * @Date: 2023-11-03 11:08:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-30 15:18:16
 * @FilePath: \5G_TELEC_TEST\src\customTypes\resultType.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
//最内侧Item
export interface SubItem {
  RBNum: string;
  RBStart: string;
  modulate: string;
  result: string;
  id: string;
  rangeList?: any[];
}

export interface SupItem {
  Band: string;
  LTE_Band: string;
  LTE_ARFCN: number;
  LTE_FREQ: number;
  LTE_duplexMode: string;
  SCS: number;
  BW: number;
  MAX_BW: number;
  ARFCN: number;
  DLFreq: number;
  level: string;
  duplexMode: string;
  MOP_LOW_Limit: number;
  MOP_UP_Limit: number;
  PowerClass: number;
  fullRBNum?: string;
  fullRBStart?: string;
  subList: SubItem[];
  id: string;
}
export interface BandListType {
  id: string;
  Band: string;
  BandId:string;
  duplexMode: string;
  LTE_Band?: string[] | [];
  SCS: number;
  BW: number[];
  ARFCN: number[];
  PowerClass: 23 | 26;
  MOP_LOW_Limit?: number | string | undefined;
  MOP_UP_Limit?: number | string | undefined;
  supList: SupItem[];
}
export interface ResultItemInterface {
  networkMode: string;
  testItem: string;
  startTime: string;
  endTime: string;
  BandList: BandListType[];
}
export type ResultInterface = ResultItemInterface[];

export type ResultItemType = {
  id: number;
  networkMode: string;
  testItem: string;
  testItemId: string;
  Band: string;
  BandId: string;
  LTE_Band: string;
  supId: string;
  SCS: number;
  BW: number;
  ARFCN: number;
  PowerClass: number;
  duplexMode: string;
  LTE_duplexMode?: string;
  LOW_Limit?: number;
  UP_Limit?: string;
  LTE_ARFCN?: number;
  LTE_FREQ?: number;
  LTE_BW?: string;
  DLFreq: number;
  level: string;
  Modulation: string;
  RBName: string;
  RBNum: number;
  RBStart: number;
  result: number | string;
};

export interface TestItemInterface {
  networkMode: string;
  testItem: string;
  testItemId: string;
  startTime: string;
  endTime: string;
  BandList: BandListType[];
}
