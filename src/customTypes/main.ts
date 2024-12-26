/*
 * @Author: feifei
 * @Date: 2023-11-03 11:40:24
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-25 11:47:58
 * @FilePath: \pxa_signal_analyzer\src\customTypes\main.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { CellValue } from 'exceljs';
import { OFDMType } from './index';
///BandList
export type BandInfoType = {
  id: number;
  Band: string;
  bandType: 'TELEC' | 'LTE';
  duplexMode: string;
  MOP_LOW_Limit?: number;
  MOP_UP_Limit?: number;
  FL: number;
  FH: number;
  CSE_Limit: string | null | undefined;
  LOW_Limit_PC2: number;
  UP_Limit_PC2: number;
  LOW_Limit_PC3: number;
  UP_Limit_PC3: number;
};

export type BandObjType = {
  TELEC: BandInfoType[];
  LTE: BandInfoType[];
};

//LTE_ARFCN
export type FrequencyData = {
  BW: number | string;
  AFRCN: number;
  FREQ: number;
};

export type BandType = Record<string, FrequencyData[]>;

export type LTE_ARFCN_TYPE = Record<string, BandType>;

export type SpuriousAreaConfigItemType = {
  Start: string;
  Stop: string;
  RBW: string;
  VBW: string;
  Att: string;
  SweepTime: string;
  SweepPoints: string;
  MaxAvgNum: string;
  Limit: string;
};
export type SpuriousAreaConfigType = Record<string, SpuriousAreaConfigItemType>;

//RB Config
export type RBSCSItemType = {
  id: number;
  SCS: number;
  testItem: string;
  BW: number;
  Modulation: string;
  RBName: string;
  RBNum: number;
  RBStart: number;
};
export type RBSCSType = Record<'15' | '30' | '60', Partial<RBSCSItemType>[]>;

export type RBConfigType = Record<string, Partial<RBSCSType>>;

//ARFCN Config

export type ARFCNItemType = {
  id: number;
  BW: number;
  Link: 'Downlink' | 'Uplink';
  Level: 'Low' | 'Mid' | 'High';
  Freq: number;
  Arfcn: number;
  SCS: number;
  Band: string;
};
export type SCSData = ARFCNItemType[];

export type BandEdgeEmissionLimitConfigType = {
  no: number;
  start: Array<string>;
  stop: Array<string>;
  RBW: Array<string>;
  VBW: Array<string>;
  limit: Array<string>;
  sweepPoint: Array<string>;
  sweepTime: Array<string>;
};

export type BandItemType = {
  Band: string;
  duplexMode: 'TDD' | 'FDD';
  FL: number;
  FH: number;
  CSE_Limit?: string | null | undefined;
  MOP_LOW_Limit?: number;
  MOP_UP_Limit?: number;
};

export type NRBandObjType = {
  FCC: BandItemType[];
  CE: BandItemType[];
  TELEC: BandItemType[];
};

export type CSELimitItemType = {
  Band: string;
  rangeStart: string;
  rangeStop: string;
  RBW: string;
  VBW: string;
  CSE_Limit: string;
  atten: string;
  sweepTime: string;
  segmentNumber: number;
};

export type ARFCNConfigItem = {
  level: string;
  SCS: number;
  Band: string;
  BW: number;
  ARFCN: string;
  Freq: string;
  isSAR: boolean;
};
export type RBConfigItem = {
  testItem: string;
  SCS: number;
  BW: number;
  OFDM: OFDMType;
  RB: string;
  num: string;
  start: string;
};
