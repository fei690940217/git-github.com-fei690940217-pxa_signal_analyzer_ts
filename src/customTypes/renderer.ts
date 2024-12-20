/*
 * @Author: feifei
 * @Date: 2023-10-17 16:56:16
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 10:25:05
 * @FilePath: \pxa_signal_analyzer\src\customTypes\renderer.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { type Key } from 'react';
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

export interface CurrentRow {
  id: string;
  created_at: string;
  projectName: string;
  testItems: string[];
  networkMode: 'NSA' | 'SA';
  LTE_BW?: number;
  LTE_ARFCN?: number;
}

export type LogListType = {
  id: string;
  createDate: string;
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
export type AddFormValueType = {
  projectName: string;
  networkMode: 'SA' | 'NSA';
  testItems: TestItemType;
  isGate: boolean;
  Band: BandItemInfo[];
  LTE_BW?: number;
  LTE_ARFCN?: number;
};

export type ProjectItemType = {
  id: string;
  createDate: string;
  projectName: string;
  networkMode: string;
  testItems: string;
  RBSelectedRowKeys: Key[];
  formValue: AddFormValueType;
};

//subProject
export type SubProjectItemType = {
  subProjectName: string;
  id: string;
  createTime: string;
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

// 定义测试配置的类型
export interface ResultItemType {
  networkMode: 'SA' | 'NSA'; // 网络模式，例如 SA
  testItem: TestItemType; // 测试项目，例如 CSE
  Band: string; // 频段，例如 n48
  LTE_Band: string[]; // LTE频段数组
  SCS: number; // 子载波间隔，单位 kHz
  BW: number; // 带宽，单位 MHz
  ARFCN: number; // 绝对射频通道号
  DLFreq: number; // 下行频率，单位 MHz
  level: string; // 测试级别，例如 Low
  FH: number; // 频率上限，单位 MHz
  FL: number; // 频率下限，单位 MHz
  CSE_Limit: number | null; // CSE 限制值
  duplexMode: 'TDD' | 'FDD'; // 双工模式，例如 TDD
  OFDM: string; // 调制模式，例如 DFT
  modulate: string; // 调制方式，例如 BPSK
  RB: string; // 资源块，例如 Inner_1RB_Left
  RBNum: string; // 资源块数量
  RBStart: string; // 资源块起始位置
  fullRBNum: string; // 全频带资源块数量
  fullRBStart: string; // 全频带资源块起始位置
  result: string; // 测试结果
  rangeStart: string; // 范围起始值
  rangeStop: string; // 范围结束值
  RBW: string; // 分辨率带宽，单位 Hz
  VBW: string; // 视频带宽，单位 Hz
  atten: string; // 衰减值
  segmentNumber: number; // 段号
  isGate: boolean; // 是否启用门控
  id: number; // 唯一标识符
}

export type StatusType = 'success' | 'error' | 'abort';

export interface BandItemInfo {
  Band: string;
  FL: number;
  FH: number;
  CSE_Limit: number | null;
  duplexMode: 'TDD' | 'FDD'; // 假设duplexMode只能是TDD或FDD
  MOP_LOW_Limit: string; // 由于值是"/"，我们将其定义为string类型
  MOP_UP_Limit: string; // 同上
  LTE_Band: string[] | null; // 空数组，但类型为number[]
  SCS: number[]; // 已知SCS是一个包含数字的数组
  BW: number[]; // 已知BW是一个包含数字的数组
  ARFCN: number[]; // 已知ARFCN是一个包含数字的数组
  PowerClass: number;
}

export type RBItemType = {
  id: Key;
  OFDM: 'DFT' | 'CP';
  modulate: 'BPSK' | 'QPSK' | '16QAM' | '64QAM' | '256QAM';
  RB: string;
  level?: 'L' | 'H';
};

export type RBObjType = {
  BandEdge: RBItemType[];
  BandEdgeIC: RBItemType[];
  PAR: RBItemType[];
  OBW: RBItemType[];
  CSE: RBItemType[];
};

export type TestItemType = 'PAR' | 'OBW' | 'CSE' | 'BandEdge' | 'BandEdgeIC';

//  supList  测试结果生成时的父级数据

export interface SupRowType {
  networkMode: 'SA' | 'NSA'; // 网络模式，例如 SA
  testItem: TestItemType; // 测试项目，例如 CSE
  Band: string; // 频段，例如 n48
  LTE_Band: string[] | null | string; // LTE频段数组
  SCS: number; // 子载波间隔，单位 kHz
  BW: number; // 带宽，单位 MHz
  ARFCN: number; // 绝对射频通道号
  DLFreq: number; // 下行频率，单位 MHz
  level: string; // 测试级别，例如 Low
  FH: number; // 频率上限，单位 MHz
  FL: number; // 频率下限，单位 MHz
  CSE_Limit: number | null; // CSE 限制值
  duplexMode: 'TDD' | 'FDD'; // 双工模式，例如 TDD
}

//nsa版本的supRow
export interface NsaSupRowType {
  networkMode: 'SA' | 'NSA'; // 网络模式，例如 SA
  testItem: TestItemType; // 测试项目，例如 CSE
  Band: string; // 频段，例如 n48
  LTE_Band: string; // LTE频段数组
  SCS: number; // 子载波间隔，单位 kHz
  BW: number; // 带宽，单位 MHz
  ARFCN: number; // 绝对射频通道号
  DLFreq: number; // 下行频率，单位 MHz
  level: string; // 测试级别，例如 Low
  FH: number; // 频率上限，单位 MHz
  FL: number; // 频率下限，单位 MHz
  CSE_Limit: number | null; // CSE 限制值
  duplexMode: 'TDD' | 'FDD'; // 双工模式，例如 TDD
}
