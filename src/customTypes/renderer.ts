/*
 * @Author: feifei
 * @Date: 2023-10-17 16:56:16
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-07 15:24:01
 * @FilePath: \5G_TELEC_TEST\src\customTypes\renderer.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

export type SelectBandItemType = {
  Band: string;
  BandId: string;
  FL?: number;
  FH?: number;
  CSE_Limit?: string | number;
  LOW_Limit_PC2: number;
  UP_Limit_PC2: number;
  LOW_Limit_PC3: number;
  UP_Limit_PC3: number;
  duplexMode: string;
  LTE_Band?: string;
  LTE_duplexMode?: string;
  SCS: number;
  BW: number[];
  PowerClass: number;
};
export type AddFormValueType = {
  projectName: string;
  networkMode: 'SA' | 'NSA';
  testItems: string;
  selectBand: SelectBandItemType[];
  LTE_BW: number;
  LTE_ARFCN: number;
};

export interface CurrentRow {
  id: string;
  created_at: string;
  projectName: string;
  testItems: string[];
  networkMode: 'NSA' | 'SA';
  LTE_BW?: number;
  LTE_ARFCN?: number;
}

export type logListType = {
  id: number;
  created_at: string;
  type: string;
  message: string;
};
export type UXMConfigType = {
  ip: string;
  sampleStatusQueryNum: number; //查询次数
  authKey: 'KEYS' | '3GPP'; //鉴权类型
  DLPower: number;
  InputPower: number;
  authKeyLTE: 'KEYS' | '3GPP';
  DLPowerLTE: number;
  InputPowerLTE: number;
  Scenario: 'PUSCH_RMC' | 'BasicScheduler';
};
export type MT8000ScriptData = {
  SA_FDD: string | undefined;
  SA_TDD: string | undefined;
  NSA_FDD: string | undefined;
  NSA_TDD: string | undefined;
};
export type MT8000ConfigType = {
  ip: string;
  sampleStatusQueryNum: number; //查询次数N
  PWR_AVG: number;
  CORESETID: 0 | 1;
  authKey: 'KEYS' | '3GPP'; //鉴权类型
  DLPower: number;
  InputPower: number;
  authKeyLTE: 'KEYS' | '3GPP';
  DLPowerLTE: number;
  InputPowerLTE: number;
  ScriptData: MT8000ScriptData;
};

export type LineLossItemType = {
  id: string;
  frequency: string;
  inputLoss: string;
  outputLoss: string;
};
export type LineLossDataType = {
  SA: LineLossItemType[];
  LTE: LineLossItemType[];
  Spectrum: LineLossItemType[];
};
export type projectItemType = {
  projectName: string;
  networkMode: string;
  testItems: string[];
  LTE_BW?: number;
  LTE_ARFCN?: number;
  selectBand: SelectBandItemType[];
  id: string;
};

//subProject
export type subProjectItemType = {
  subProjectName: string;
  id: string;
  createTime: number;
};

//leftMenuItemType
export type LeftMenuItemType = {
  id: number;
  networkMode: string;
  testItemId: string;
  testItem: string;
  Band: string;
  BandId: string;
  LTE_Band?: string;
};

export type InstrumentInfoType = {
  visaAddress: string;
  Status: boolean;
  Manufacturer: string;
  Model: string;
  SerialNumber: string;
  FirmwareVersion: string;
};

export type SpectrumConfigType = {
  POWATT: string;
  dutyCycle: number;
};
