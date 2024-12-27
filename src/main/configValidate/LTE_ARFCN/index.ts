/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\LTE_ARFCN\index.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 09:15:28
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
import { outputJson, pathExists, readJson } from 'fs-extra';
import XLSX from 'xlsx';
import mergeCellDataFill from '@src/main/utils/mergeCellDataFill';
import path from 'path';
import { appConfigFilePath } from '@src/main/publicData';
import { logError } from '@src/main/logger/logLevel';
import { xlsxDataArrayToObject, workbookNameHandle } from './util';
import { LTEARFCNItemType } from '@src/customTypes/main';

//配置文件地址
const fromPath = path.join(
  appConfigFilePath,
  'user/operating bands/LTE_ARFCN.xlsx',
);
//解析后写入本地
const toPath = path.join(appConfigFilePath, 'app/LTE_ARFCN.json');
//数据处理函数
export default async (isRefresh: boolean) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(toPath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const resultObj: Record<string, LTEARFCNItemType[]> = {};
    //判断文件是否存在
    const flag = await pathExists(fromPath);
    if (!flag) {
      throw new Error('user/operating bands/LTE_ARFCN.xlsx 文件不存在');
    }
    const wb = XLSX.readFile(fromPath);
    const { Sheets, Workbook } = wb;
    for (const item of Workbook?.Sheets || []) {
      const { name, Hidden } = item;
      if (Hidden === 1 || !name) {
        continue;
      }
      //继续处理
      const sheet = Sheets[name];
      //解析表
      const json = XLSX.utils.sheet_to_json<any[][]>(sheet, {
        range: 0,
        header: 1,
        defval: '',
        raw: false, // 禁用原始文本模式
        // blankrows: false, // 不忽略空行
      });
      //mergeCellDataFill,填充合并单元格
      const merges = sheet['!merges'];
      const fillJson = mergeCellDataFill(merges, json);
      const Band = workbookNameHandle(name);
      if (!Band) {
        continue;
      }
      const TEMP_RST = xlsxDataArrayToObject(fillJson, Band);
      resultObj[Band] = TEMP_RST;
    }
    await outputJson(toPath, resultObj);
    return Promise.resolve();
  } catch (error) {
    const msg = `${error?.toString()} LTE_ARFCN.ts 74`;
    logError(msg);
  }
};
