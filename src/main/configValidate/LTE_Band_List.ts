/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\LTE_Band_List.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 09:46:37
 * @Descripttion:CSE limit与Band对照表
 */

import path from 'path';
import { appConfigFilePath } from '../publicData';
import XLSX from 'xlsx';
import { outputJson, pathExists } from 'fs-extra';
import { logError } from '../logger/logLevel';
import { BandItemType } from '@src/customTypes/main';
type KeyType = 'Band' | 'FL' | 'FH' | 'duplexMode';
type LTEBandItemType = {
  Band: string;
  duplexMode: 'TDD' | 'FDD';
  FL: number;
  FH: number;
};
const header: KeyType[] = ['Band', 'FL', 'FH', 'duplexMode'];
//配置文件地址 源文件
const fromPath = path.join(
  appConfigFilePath,
  'user/operating bands/LTE_Band.xlsx',
);
//写入本地 解析后写入本地
const toPath = path.join(appConfigFilePath, 'app/LTE_Band_List.json');
export default async (isRefresh: boolean) => {
  try {
    //如果是刷新则直接重新生成
    if (!isRefresh) {
      const flag = await pathExists(toPath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const reg = /\s+/g;
    //判断文件是否存在
    const flag = await pathExists(fromPath);
    if (!flag) {
      throw new Error('user/operating bands/LTE_Band.xlsx 文件不存在');
    }
    const wb = XLSX.readFile(fromPath);
    //判断文件是否存在
    const { Sheets, SheetNames } = wb;
    const sheet = Sheets[SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<LTEBandItemType>(sheet, {
      range: 0,
      header,
      defval: '',
      raw: false, // 禁用原始文本模式
      // blankrows: false, // 不忽略空行
    });
    await outputJson(toPath, json);
    return Promise.resolve();
  } catch (error) {
    const errmsg = `${error?.toString()} LTE_Band_List.ts 生成失败`;
    logError(errmsg);
    return Promise.reject();
  }
};
